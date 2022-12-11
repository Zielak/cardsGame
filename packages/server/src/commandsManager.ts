import { chalk, logs } from "@cardsgame/utils"

import type { BaseActionDefinition } from "./actions/base.js"
import type {
  ActionsCollection,
  CollectionConditionsResult,
  CollectionContext,
} from "./actions/collection.js"
import {
  CompoundActionDefinition,
  CompoundContext,
  isCompoundActionDefinition,
} from "./actions/compoundAction.js"
import {
  isRootActionDefinition,
  RootActionDefinition,
  RootContext,
} from "./actions/rootAction.js"
import type { Command } from "./command.js"
import { Undo } from "./commands/undo.js"
import {
  ClientMessageConditions,
  ClientMessageInitialSubjects,
} from "./interaction/conditions.js"
import type { Player, ServerPlayerMessage } from "./player/index.js"
import type { Room } from "./room/base.js"
import type { State } from "./state/state.js"

/**
 * @ignore
 */
export class CommandsManager<S extends State> {
  history: Command[] = []
  incoming: Map<Player, ServerPlayerMessage> = new Map()

  // TODO: https://miro.com/app/board/uXjVO-eFeDg=/?moveToWidget=3458764538687486805&cot=14

  /**
   * Map of clientID to a tuple of:
   *
   * - compound action object
   * - data gathered from that action, for this player
   */
  pendingActions: Map<Player["clientID"], CompoundActionDefinition<S>>

  possibleActions: RootActionDefinition<S>

  constructor(private readonly room: Room<S>) {
    this.possibleActions = new RootActionDefinition<S>(room.possibleActions)

    this.pendingActions = new Map()
  }

  /**
   * @returns `false` when command throws with an error/fails to execute.
   */
  handlePlayerEvent(message: ServerPlayerMessage): Promise<boolean> {
    if (this.playerHasActionPending(message.player)) {
      return this.run(message, this.pendingActions.get(message.player.clientID))
    } else {
      return this.run(message)
    }
  }

  run(
    message: ServerPlayerMessage,
    pendingAction?: CompoundActionDefinition<S>
  ): Promise<boolean> {
    const action: ActionsCollection<S> = pendingAction ?? this.possibleActions
    const context = action.setupContext()

    // 1. Prerequisites
    const prerequisitesResult = this.runPrerequisites(message, action, context)

    if (!prerequisitesResult) {
      action.teardownContext(context)
      this.throwNoActions(message)
    }

    // 2. Conditions
    const conditionsResult = this.runConditions(message, action, context)

    if (!conditionsResult) {
      action.teardownContext(context)
      this.throwNoActions(message)
    }

    // 3. Command
    const chosenCommand = this.pickCommand(message, action, context)

    // 4. Pending actions
    this.handlePendingActions(message, action, context)

    action.teardownContext(context)

    // 5. Run the command
    return this.executeCommand(this.room.state, chosenCommand)
  }

  runPrerequisites(
    message: ServerPlayerMessage,
    action: ActionsCollection<S>,
    context: CollectionContext<S>
  ): boolean {
    const tmpCount = action.allActionsCount()

    // Prerequisites
    logs.group(chalk.blue("Prerequisites"))

    const prerequisitesResult = action.checkPrerequisites(message, context)

    logs.groupEnd(
      `actions count: ${tmpCount} => ${action.successfulActionsCount(context)}`
    )

    return prerequisitesResult
  }

  runConditions(
    message: ServerPlayerMessage,
    action: ActionsCollection<S>,
    context: CollectionContext<S>
  ): boolean {
    const { state } = this.room
    const tmpCount = action.successfulActionsCount(context)

    logs.group(chalk.blue("Conditions"))

    // TODO: butcher `runAllConditions` and simplify it all in here
    /**
     * 1. setup initialSubjects and conditionsChecker
     * 2. run `checkConditions` on each sub actions (children or root OR children of pending)
     * 3. gather each sub-actions results/errors
     * 4. if all sub-actions fail, report all the errors. Otherwise continue.
     */

    // 1. setup initialSubjects and conditionsChecker
    const initialSubjects = Object.keys(message)
      .filter((key) => !["timestamp", "entities", "entityPath"].includes(key))
      .reduce((o, key) => {
        o[key] = message[key]
        return o
      }, {} as ClientMessageInitialSubjects)

    const conditionsChecker = new ClientMessageConditions<S>(
      state,
      initialSubjects
    )

    // 2. run `checkConditions` on each sub actions (children or root OR children of pending)
    // 3. gather each sub-actions results/errors
    const rejectedActions = action.checkConditions(
      conditionsChecker,
      initialSubjects,
      context
    )

    logs.groupEnd(
      `actions count: ${tmpCount} => ${action.successfulActionsCount(context)}`
    )

    // 4. if all sub-actions fail, report all the errors. Otherwise continue.
    if (action.successfulActionsCount(context) === 0) {
      this.reportFailedActionConditions(message, rejectedActions)
      return false
    }
    return true
  }

  pickCommand(
    message: ServerPlayerMessage,
    action: ActionsCollection<S>,
    context: CollectionContext<S>
  ): Command<S> {
    const { state } = this.room

    const successCount = action.successfulActionsCount(context)

    if (successCount > 1) {
      logs.warn(
        "handlePlayerEvent",
        `Whoops, even after filtering actions by conditions, I still have ${successCount} actions! Applying only the first one (ordering actions matters!).`
      )
    }

    return action.getCommand(state, message, context)
  }

  handlePendingActions(
    message: ServerPlayerMessage,
    action: ActionsCollection<S>,
    context: CollectionContext<S>
  ): void {
    if (
      isCompoundActionDefinition(action) &&
      action.hasFinished(context as CompoundContext<S>)
    ) {
      // We were checking against a pending compound action
      // and it reported to have finished.
      if (this.pendingActions.get(message.player.clientID) !== action) {
        // Sanity check error...
        action.teardownContext(context as CompoundContext<S>)
        throw new Error(
          "We just run compound action, but it wasn't the one pending o.O"
        )
      }
      logs.debug(
        "HandlePending",
        `deleting "${action.name}" action from player:`,
        message.player.clientID
      )
      this.pendingActions.delete(message.player.clientID)
    } else if (isRootActionDefinition(action)) {
      // We were checking against all actions in Root collection
      // and the last successful action is compound, reporting as pending
      const rootContext = context as RootContext<S>
      const [subAction] = rootContext.successfulActions
      const subContext = rootContext.subContexts.get(subAction)

      if (
        isCompoundActionDefinition(subAction) &&
        !subAction.hasFinished(subContext as CompoundContext<S>)
      ) {
        logs.debug(
          "HandlePending",
          `setting "${subAction.name}" action for player:`,
          message.player.clientID
        )
        this.pendingActions.set(message.player.clientID, subAction)
      }
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
   * Does given player have some unfinished actions?
   */
  private playerHasActionPending(player: Player): boolean {
    return this.pendingActions.has(player.clientID)
  }

  /**
   * There were no successful actions remaining.
   */
  private throwNoActions(message: ServerPlayerMessage): void {
    throw new Error(
      `No more actions to evaluate for "${
        message.player ? message.player.clientID : message.interaction
      }" event, ignoring...`
    )
  }

  /**
   * Call when all actions fail on conditions check.
   * Will send the message back to player, with reasons for failure.
   */
  private reportFailedActionConditions(
    message: ServerPlayerMessage,
    rejectedActions: CollectionConditionsResult<BaseActionDefinition<S>, S>
  ): void {
    logs.error(`${rejectedActions.size} actions didn't pass. Reasons:`)
    rejectedActions.forEach((error, action) => {
      logs.error(
        `- ${action.name}: ${error.message}${
          error.internal ? "(internal)" : ""
        }`
      )
    })

    const client = this.room.clients.find(
      (client) => client.sessionId === message.player.clientID
    )

    rejectedActions.forEach((error, action) => {
      if (!error.internal) {
        logs.debug(
          "sending an error message to",
          message.player.clientID,
          client.sessionId,
          error
        )
        client.send("gameWarn", {
          data: `${action.name}: ${error.message}`,
        } as ServerMessageTypes["gameWarn"])
      }
    })
  }
}
