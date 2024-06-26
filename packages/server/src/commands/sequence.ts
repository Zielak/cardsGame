import type { Room } from "@/room/base.js"
import type { State } from "@/state/state.js"

import { Command } from "../command.js"
import { logs } from "../logs.js"

export class Sequence extends Command {
  /**
   * @param name name this Sequence (useful for debugging)
   * @param subCommands
   */
  constructor(name: string, subCommands: Command[]) {
    super(`${name}Sequence`)
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
    logs.group(`Commands group: ${this.name}._executeSubCommands()`)
    for (const command of this._subCommands) {
      logs.log(`- ${command.name}: executing`)
      await command.execute(state, room)
    }
    logs.groupEnd()
  }
}
