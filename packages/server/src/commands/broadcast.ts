import { Command } from "../command"
import { Room } from "../room"
import { State } from "../state/state"

export class Broadcast extends Command {
  constructor(public type: string, public message?: ServerMessage) {
    super()
  }

  async execute(state: State, room: Room<any>): Promise<void> {
    room.broadcast(this.type, this.message)
  }

  async undo(state: State, room: Room<any>): Promise<void> {
    room.broadcast(this.type, {
      ...this.message,
      undo: true,
    })
  }
}
