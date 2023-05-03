import { Command } from "../command.js"
import type { Room } from "../room/base.js"
import type { State } from "../state/state.js"

export class Broadcast<
  MoreMessageTypes extends Record<string, unknown> = Record<string, unknown>,
  T extends keyof AllServerMessageTypes<MoreMessageTypes> = keyof AllServerMessageTypes<MoreMessageTypes>
> extends Command {
  public type: T
  public message: AllServerMessageTypes<MoreMessageTypes>[T]

  constructor(type: T, message?: AllServerMessageTypes<MoreMessageTypes>[T]) {
    super()

    this.type = type
    this.message = message
  }

  async execute(
    state: State,
    room: Room<any, MoreMessageTypes>
  ): Promise<void> {
    room.broadcast(this.type, this.message)
  }

  async undo(state: State, room: Room<any, MoreMessageTypes>): Promise<void> {
    room.broadcast(this.type, this.message, { undo: true })
  }
}

type keys = keyof ServerMessageTypes | keyof { test: number }

let T: keys
