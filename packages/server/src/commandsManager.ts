import { logs } from "@cardsgame/utils"

import { ActionsSet } from "./actionTemplate"
import { Command } from "./command"
import {
  filterActionsByConditions,
  filterActionsByInteraction,
} from "./interaction"
import { isBot } from "./players/bot"
import { ServerPlayerEvent } from "./players/player"
import { Room } from "./room"
import { State } from "./state/state"

export class CommandsManager<S extends State> {
  history: Command[] = []

  currentCommand: Command
  actionPending = false

  possibleActions: ActionsSet<S>

  constructor(private room: Room<S>) {
    this.possibleActions = room.possibleActions
  }

  handlePlayerEvent(event: ServerPlayerEvent): Promise<boolean> {
    const { state } = this.room

    if (this.actionPending) {
      // Early quit, current action is still on-going.
      throw new Error(
        `Other action is still in progress (command "${this.currentCommand?.name}") - ignoring interaction...`
      )
    }

    let actions = Array.from(this.possibleActions.values())
    if (!isBot(event.player)) {
      actions = actions.filter(filterActionsByInteraction(event))
    }
    actions = actions.filter(filterActionsByConditions(state, event))

    if (actions.length === 0) {
      throw new Error(
        `No actions found for that "${event.event}" event, ignoring...`
      )
    }

    if (actions.length > 1) {
      logs.warn(
        "performAction",
        `Whoops, even after filtering actions by conditions, I still have ${actions.length} actions! Applying only the first one (ordering actions matter!).`
      )
    }

    return this.executeCommand(state, actions[0].getCommand(state, event))
  }

  async executeCommand(state: S, command: Command): Promise<boolean> {
    const commandName = command.name

    this.currentCommand = command
    this.actionPending = true

    logs.group(commandName, "executing")
    try {
      await this.currentCommand.execute(state, this.room)
    } catch (error) {
      logs.error("parseAction", `action FAILED, will try do undo it.`, error)
      await this.currentCommand.undo(state, this.room)
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
