import { Command } from "../command"
import { State } from "../state"
import { Room } from "../room"

export class Broadcast extends Command {
  _name = "Broadcast"

  constructor(public message: ServerMessage) {
    super()
  }

  async execute(state: State, room: Room<any>) {
    room.broadcast(this.message)
  }

  async undo(state: State, room: Room<any>) {
    room.broadcast({
      ...this.message,
      undo: true
    })
  }
}
