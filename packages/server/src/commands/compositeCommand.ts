import { State } from "../state"
import { ICommand } from "../command"

export class CompositeCommand implements ICommand {
  constructor(private commands: ICommand[]) {}
  execute(state: State) {
    for (let i = 0; i < this.commands.length; i++) {
      this.commands[i].execute(state)
    }
  }
  undo(state: State) {
    for (let i = this.commands.length; i > 0; i--) {
      if (!this.commands[i].undo) return
      this.commands[i].undo(state)
    }
  }
}
