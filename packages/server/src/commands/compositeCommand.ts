import { State } from "../state"
import { ICommand } from "."
import { Room } from "../room"
import { logs } from "@cardsgame/utils"

export class CompositeCommand implements ICommand {
  private commands: ICommand[]

  constructor(...commands: ICommand[]) {
    this.commands = commands.filter(c => typeof c === "object")
  }

  execute(state: State, room: Room<any>) {
    for (let i = 0; i < this.commands.length; i++) {
      const command = this.commands[i]
      logs.notice(`\t${command._name}: executing`)
      command.execute(state, room)
    }
  }

  undo(state: State, room: Room<any>) {
    for (let i = this.commands.length; i > 0; i--) {
      const command = this.commands[i]
      if (command.undo) {
        command.undo(state, room)
      } else {
        logs.error(
          `${command.constructor.name}.undo`,
          "this command is undoable ):"
        )
      }
    }
  }
}
