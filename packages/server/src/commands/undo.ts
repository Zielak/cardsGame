import { Command } from "../command.js"
import type { Room } from "../room/base.js"
import type { State } from "../state/state.js"

export class Undo extends Command {
  constructor() {
    super()
  }

  async execute(state: State, room: Room<any>): Promise<void> {
    await room.commandsManager.undoLastCommand(state)
  }

  async undo(): Promise<void> {
    throw new Error(
      "Undo.undo() should not be executed, and shouldn't even be stored in history. 'Redo' is just not implemented."
    )
  }
}
