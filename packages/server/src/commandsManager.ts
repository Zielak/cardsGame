import { chalk, logs } from "@cardsgame/utils"

import type { ActionsSet, ActionTemplate } from "./actionTemplate"
import type { Command } from "./command"
import {
  runConditionsOnAction,
  filterActionsByInteraction,
} from "./interaction"
import type { Player, ServerPlayerMessage } from "./player"
import type { Room } from "./room"
import type { State } from "./state"

export class CommandsManager<S extends State> {
  history: Command[] = []
  incoming: Map<Player, ServerPlayerMessage> = new Map()

  currentCommand: Command
  actionPending = false

  possibleActions: ActionsSet<S>

  constructor(private readonly room: Room<S>) {
    this.possibleActions = room.possibleActions
  }

  /**
   * @returns `false` when command throws with an error/fails to execute.
   */
  handlePlayerEvent(message: ServerPlayerMessage): Promise<boolean> {
    const { state } = this.room

    if (this.actionPending) {
      // Toss that event to `incoming`, will get back at
      // it after current action is finished
      logs.info(
        "handlePlayerEvent",
        `Other action is still in progress, tossing new one to "incoming"...`
      )
      // TODO: actually handle that...
      this.incoming.set(message.player, message)
    }

    let actions = Array.from(this.possibleActions.values())
    let subCountActions = actions.length

    logs.group(chalk.blue("Interactions"))
    actions = actions.filter(filterActionsByInteraction(message))
    logs.groupEnd(`actions count: ${subCountActions} => ${actions.length}`)
    subCountActions = actions.length

    logs.group(chalk.blue("Conditions"))

    const conditionsErrors = new Map<
      ActionTemplate<S>,
      ReturnType<typeof runConditionsOnAction>
    >()

    actions = actions.filter((action) => {
      const error = runConditionsOnAction(state, message, action)
      if (error) {
        conditionsErrors.set(action, error)
      }

      return typeof error === "undefined"
    })

    logs.groupEnd(`actions count: ${subCountActions} => ${actions.length}`)

    if (actions.length === 0) {
      logs.error(`${conditionsErrors.size} actions didn't pass. Reasons:`)
      logs.error(
        [...conditionsErrors.entries()].map(
          ([action, error]) =>
            `- ${action.name}: ${error.message}${
              error.internal ? "(internal)" : ""
            }`
        )
      )

      const client = this.room.clients.find(
        (client) => client.sessionId === message.player.clientID
      )

      conditionsErrors.forEach((error, action) => {
        logs.debug(
          "sending an error message to",
          message.player.clientID,
          client.sessionId,
          error
        )
        if (!error.internal) {
          client.send("gameWarn", {
            data: `${action.name}: ${error.message}`,
          } as ServerMessageTypes["gameWarn"])
        }
      })

      throw new Error(
        `No actions found for "${
          message.player ? message.player.clientID : message.event
        }" event, ignoring...`
      )
    }

    if (actions.length > 1) {
      logs.warn(
        "handlePlayerEvent",
        `Whoops, even after filtering actions by conditions, I still have ${actions.length} actions! Applying only the first one (ordering actions matters!).`
      )
    }

    return this.executeCommand(state, actions[0].command(state, message))
  }

  async executeCommand(state: S, command: Command): Promise<boolean> {
    const commandName = command.name

    this.currentCommand = command
    this.actionPending = true

    logs.group(commandName, "executing")
    try {
      await this.currentCommand.execute(state, this.room)
    } catch (error) {
      // TODO: Undo anything that recently failed
      // logs.error("parseAction", `action FAILED, will try do undo it.`, error)
      // await this.currentCommand.undo(state, this.room)
      logs.error("parseAction", `action FAILED`, error)
      logs.groupEnd(commandName, "failed")

      return false
    }
    logs.groupEnd(commandName, "done")

    this.actionPending = false
    this.currentCommand = null
    this.history.push(command)

    return true
  }
}
