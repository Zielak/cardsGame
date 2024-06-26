import chalk from "chalk"

import type { BaseActionDefinition } from "@/actions/base.js"
import {
  CollectionActionDefinition,
  CollectionConditionsResult,
  CollectionContext,
} from "@/actions/collection/collection.js"
import { extendsCollectionActionDefinition } from "@/actions/collection/utils.js"
import { Undo } from "@/commands/undo.js"
import { Conditions } from "@/conditions/conditions.js"
import {
  ClientMessageContext,
  playerMessageToInitialSubjects,
} from "@/conditions/context/clientMessage.js"
import { prepareConditionsContext } from "@/conditions/context/utils.js"
import type { Player, ServerPlayerMessage } from "@/player/index.js"
import type { Room } from "@/room/base.js"
import type { State } from "@/state/state.js"

import {
  RootActionDefinition,
  RootContext,
} from "../actions/root/rootAction.js"
import { isRootActionDefinition } from "../actions/root/utils.js"
import type { Command } from "../command.js"
import { logs } from "../logs.js"

import { prepareActionContext } from "./utils.js"

/**
 * @ignore
 */
export class CommandsManager<S extends State> {
  history: Command[] = []

  /**
   * Map of clientID to a tuple of:
   *
   * - compound action object
   * - data gathered from that action, for this player
   */
  pendingActions: Map<
    Player["clientID"],
    { action: CollectionActionDefinition<S>; context: CollectionContext }
  >

  possibleActions: RootActionDefinition<S>

  constructor(private readonly room: Room<S>) {
    this.possibleActions = new RootActionDefinition<S>(room.possibleActions)

    this.pendingActions = new Map()
  }

  /**
   * @throws when all actions fail to execute
   * @returns TODO: why would this return?
   */
  handlePlayerEvent(message: ServerPlayerMessage): Promise<boolean> {
    const pendingEntry = this.pendingActions.get(message.player.clientID)

    const action = pendingEntry?.action ?? this.possibleActions
    const context = pendingEntry?.context ?? prepareActionContext(action)

    return this.run(message, action, context)
  }

  async run(
    message: ServerPlayerMessage,
    action: CollectionActionDefinition<S>,
    context: CollectionContext,
  ): Promise<boolean> {
    const initialSubjects = playerMessageToInitialSubjects(message)
    const messageContext = prepareConditionsContext(
      this.room.state,
      initialSubjects,
    )

    // 1. Prerequisites
    const prerequisitesResult = this.runPrerequisites(
      messageContext,
      action,
      context,
    )

    if (!prerequisitesResult) {
      this.runFailed(message, action, context)
      return
    }

    // 2. Conditions
    const conditionsResult = this.runConditions(
      message,
      messageContext,
      action,
      context,
    )

    if (!conditionsResult) {
      this.runFailed(message, action, context)
      return
    }

    // 3. Command
    const chosenCommand = this.pickCommand(messageContext, action, context)

    // 4. Run the command
    const commandResult = await this.executeCommand(
      this.room.state,
      chosenCommand,
    )

    // 5. Pending actions
    if (commandResult) {
      this.handlePendingActions(message, action, context)

      this.runSuccessful(message)
    }

    return commandResult
  }

  runPrerequisites(
    messageContext: ClientMessageContext<S>,
    action: CollectionActionDefinition<S>,
    actionContext: CollectionContext,
  ): boolean {
    const tmpCount = action._allActionsCount?.() || "?"

    // Prerequisites
    logs.group(chalk.blue("Prerequisites"))

    const prerequisitesResult = action.checkPrerequisites(
      messageContext,
      actionContext,
    )

    logs.groupEnd(
      `actions count: ${tmpCount} => ${action._successfulActionsCount?.(
        actionContext,
      )}`,
    )

    return prerequisitesResult
  }

  runConditions(
    message: ServerPlayerMessage,
    messageContext: ClientMessageContext<S>,
    action: CollectionActionDefinition<S>,
    context: CollectionContext,
  ): boolean {
    const tmpCount = action._successfulActionsCount?.(context)

    logs.group(chalk.blue("Conditions"))

    /**
     * 1. setup initialSubjects and conditionsChecker
     * 2. run `checkConditions` on each sub actions (children or root OR children of pending)
     * 3. gather each sub-actions results/errors
     * 4. if all sub-actions fail, report all the errors. Otherwise continue.
     */

    // 1. setup initialSubjects and conditionsChecker
    const conditionsChecker = new Conditions(messageContext)

    // 2. run `checkConditions` on each sub actions (children or root OR children of pending)
    // 3. gather each sub-actions results/errors
    const rejectedActions = action.checkConditions(
      conditionsChecker,
      messageContext,
      context,
    )

    logs.groupEnd(
      `actions count: ${tmpCount} => ${action._successfulActionsCount?.(
        context,
      )}`,
    )

    // 4. if all sub-actions fail, report all the errors. Otherwise continue.
    if (!action.hasSuccessfulSubActions(context)) {
      this.reportFailedActionConditions(message, rejectedActions)
      return false
    }
    return true
  }

  pickCommand(
    messageContext: ClientMessageContext<S>,
    action: CollectionActionDefinition<S>,
    context: CollectionContext,
  ): Command<S> {
    const successCount = action._successfulActionsCount?.(context)

    if (successCount > 1) {
      logs.warn(
        "handlePlayerEvent",
        `Whoops, even after filtering actions by conditions, I still have ${successCount} actions! Applying only the first one (ordering actions matters!).`,
      )
    }

    return action.getCommand(messageContext, context)
  }

  handlePendingActions(
    message: ServerPlayerMessage,
    action: CollectionActionDefinition<S>,
    context: CollectionContext,
  ): void {
    if (isRootActionDefinition(action)) {
      // We were checking against all actions in Root collection
      // and the last successful action is reporting as pending
      const rootContext = context as CollectionContext<RootContext<S>>
      const [subAction] = rootContext.successfulActions
      const subContext = rootContext.subContexts.get(subAction)

      if (
        extendsCollectionActionDefinition(subAction) &&
        !subAction.hasFinished(subContext)
      ) {
        logs.debug(
          "HandlePending",
          `setting "${subAction.name}" action for player:`,
          message.player.clientID,
        )
        subContext.pending = true
        this.pendingActions.set(message.player.clientID, {
          action: subAction,
          context: subContext,
        })
      }

      action.teardownContext(rootContext)
    } else if (
      extendsCollectionActionDefinition(action) &&
      action.hasFinished(context)
    ) {
      // We were checking against a pending action
      // and it reported to have finished.
      if (this.pendingActions.get(message.player.clientID).action !== action) {
        // Sanity check error...
        throw new Error(
          "We just run collection action, but it wasn't the one pending o.O",
        )
      }

      logs.debug(
        "HandlePending",
        `deleting "${action.name}" action from player:`,
        message.player.clientID,
      )
      action.teardownContext(context)
      this.pendingActions.delete(message.player.clientID)
    }
  }

  async executeCommand(state: S, command: Command): Promise<boolean> {
    const commandName = command.name

    logs.group(commandName, "executing")
    try {
      await command.execute(state, this.room)
    } catch (error) {
      // TODO: Undo anything that recently failed
      // logs.error("parseAction", `action FAILED, will try do undo it.`, error)
      // await this.currentCommand.undo(state, this.room)
      logs.error("parseAction", `action FAILED`, error)
      logs.groupEnd(commandName, "failed")

      return false
    }
    logs.groupEnd(commandName, "done")

    if (!(command instanceof Undo)) {
      this.history.push(command)
    }

    return true
  }

  async undoLastCommand(state: S): Promise<void> {
    if (this.history.length === 0) {
      logs.error("undo", `history is empty, nothing to undo`)
      return
    }

    const lastCommand = this.history.pop()

    logs.group(lastCommand.name, "UNDO")

    try {
      await lastCommand.undo(state, this.room)
      logs.groupEnd(lastCommand.name, "UNDO | done")
    } catch (error) {
      logs.error("undo", `action FAILED`, error)
      logs.groupEnd(lastCommand.name, "UNDO | failed")
    }
  }

  /**
   * There were no successful actions remaining.
   * @throws
   */
  private runFailed(
    message: ServerPlayerMessage,
    action: CollectionActionDefinition<S>,
    context: CollectionContext,
  ): void {
    if (message.player.dragStartEntity) {
      this.sendMessage(message.player.clientID, "dragStatus", {
        data: {
          interaction: message.interaction,
          idxPath: message.player.dragStartEntity.idxPath.join(","),
          status: false,
        },
      } as ServerMessageTypes["dragStatus"])
    }

    if (context.aborted) {
      this.pendingActions.delete(message.player.clientID)
      logs.debug(
        "runFailed",
        "Action marked `aborted` in its context. Removing from pending",
      )
    }

    action.teardownContext(context)

    // throwNoActions
    throw new Error(
      `No more actions to evaluate for "${
        message.player ? message.player.clientID : message.interaction
      }" event, ignoring...`,
    )
  }

  private runSuccessful(message: ServerPlayerMessage): void {
    const { interaction, player } = message

    if (player.dragStartEntity) {
      // TODO: move to Drag Action?
      // debugger // is this even happening?
      this.sendMessage(player.clientID, "dragStatus", {
        data: {
          interaction: interaction,
          idxPath: player.dragStartEntity.idxPath.join(","),
          status: true,
        },
      } as ServerMessageTypes["dragStatus"])
    }
  }

  /**
   * Call when all actions fail on conditions check.
   * Will send the message back to player, with reasons for failure.
   */
  private reportFailedActionConditions(
    message: ServerPlayerMessage,
    rejectedActions: CollectionConditionsResult<BaseActionDefinition<S>>,
  ): void {
    const { clientID } = message.player
    logs.error(`${rejectedActions.size} actions didn't pass. Reasons:`)
    rejectedActions.forEach((error, action) => {
      logs.error(
        `- ${action.name}: ${error.message}${
          error.internal ? "(internal)" : ""
        }`,
      )
    })

    rejectedActions.forEach((error, action) => {
      if (!error.internal) {
        logs.debug("sending an error message to", clientID, error)

        this.sendMessage(clientID, "gameWarn", {
          data: `${action.name}: ${error.message}`,
        } as ServerMessageTypes["gameWarn"])
      }
    })
  }

  private sendMessage(clientID: string, type: string, message: any): void {
    const client = this.room.clients.find(
      (client) => client.sessionId === clientID,
    )

    logs.info("sendMessage", clientID, type, message)

    client?.send(type, message)
  }
}
