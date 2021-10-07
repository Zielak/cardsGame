import { chalk, logs } from "@cardsgame/utils"

import { ActionsSet } from "./actionTemplate"
import { Command } from "./command"
import {
  filterActionsByConditions,
  filterActionsByInteraction,
} from "./interaction"
import { Player, ServerPlayerMessage } from "./players/player"
import { Room } from "./room"
import { State } from "./state"

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
    actions = actions.filter(filterActionsByConditions(state, message))
    logs.groupEnd(`actions count: ${subCountActions} => ${actions.length}`)

    if (actions.length === 0) {
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
