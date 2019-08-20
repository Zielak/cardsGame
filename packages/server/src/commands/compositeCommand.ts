import { State } from "../state"
import { ICommand } from "."
import { Room } from "../room"

export class CompositeCommand implements ICommand {
  private commands: ICommand[]

  constructor(commands: ICommand | ICommand[]) {
    this.commands = !Array.isArray(commands) ? [commands] : commands
  }
  execute(state: State, room: Room<any, any>) {
    for (let i = 0; i < this.commands.length; i++) {
      this.commands[i].execute(state, room)
    }
  }
  undo(state: State, room: Room<any, any>) {
    for (let i = this.commands.length; i > 0; i--) {
      if (!this.commands[i].undo) return
      this.commands[i].undo(state, room)
    }
  }
}
