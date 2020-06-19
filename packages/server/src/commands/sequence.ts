import { logs } from "@cardsgame/utils"

import { Command } from "../command"
import { Room } from "../room"
import { State } from "../state/state"

export class Sequence extends Command {
  /**
   * @param name name this Sequence (useful for debugging)
   * @param subCommands
   */
  constructor(name: string, subCommands: Command[]) {
    super(name + "Sequence")
    this._subCommands = subCommands
      ? subCommands.filter((c) => typeof c === "object")
      : []
  }

  /**
   * Run only registered sub commands.
   * An un-doing of these will be handled by parent class `Command`
   * @param state
   * @param room
   */
  async execute(state: State, room: Room<any>): Promise<void> {
    if (!this._subCommands || this._subCommands.length === 0) {
      throw new Error(`Sequence somehow lost its sub commands!`)
    }

    logs.group(`Commands group: ${this.name}._executeSubCommands()`)
    for (let i = 0; i < this._subCommands.length; i++) {
      const command = this._subCommands[i]

      logs.notice(`- ${command.name}: executing`)

      await command.execute(state, room)
    }
    logs.groupEnd()
  }
}
