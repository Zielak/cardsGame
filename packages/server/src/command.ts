import { State } from "./state"
import { Room } from "./room"
import { logs } from "@cardsgame/utils"

export class Command {
  private _subCommands: Command[]
  public _name: string

  constructor(name?: string, subCommands?: Command[]) {
    this._name = name || `Some ${subCommands ? "compund" : "plain"} command`
    this._subCommands = subCommands || []
  }

  async execute(state: State, room: Room<any>): Promise<void | Command[]> {
    logs.group(`Commands group: ${this._name}.execute()`)
    for (let i = 0; i < this._subCommands.length; i++) {
      const command = this._subCommands[i]
      const commandName = command._name || command.constructor.name

      logs.notice(`\t${commandName}: executing`)

      const result = await command.execute(state, room)
      if (Array.isArray(result)) {
        await new Command(commandName, result).execute(state, room)
      }
    }
    logs.groupEnd()
  }

  async undo(state: State, room: Room<any>) {
    logs.group(`Commands group: ${this._name}.undo()`)
    for (let i = this._subCommands.length; i > 0; i--) {
      const command = this._subCommands[i]
      if (command.undo) {
        command.undo(state, room)
      }
    }
    logs.groupEnd()
  }
}
