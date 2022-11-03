import { Command } from "../command.js"
import type { Room } from "../room.js"
import type { State } from "../state/state.js"

export class Broadcast<
  MessageTypes extends Record<string, unknown>
> extends Command {
  constructor(public type: keyof MessageTypes, public message?: unknown) {
    super()
  }

  async execute(state: State, room: Room<any>): Promise<void> {
    room.broadcast(this.type as string, this.message)
  }

  async undo(state: State, room: Room<any>): Promise<void> {
    room.broadcast(this.type as string, this.message, { undo: true })
  }
}
