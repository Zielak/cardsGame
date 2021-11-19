import { Command } from "../command"
import type { Room } from "../room"
import type { State } from "../state"

export class Broadcast extends Command {
  constructor(public type: string, public message?: unknown) {
    super()
  }

  async execute(state: State, room: Room<any>): Promise<void> {
    room.broadcast(this.type, this.message ? { data: this.message } : undefined)
  }

  async undo(state: State, room: Room<any>): Promise<void> {
    room.broadcast(
      this.type,
      this.message
        ? {
            data: this.message,
            undo: true,
          }
        : { undo: true }
    )
  }
}
