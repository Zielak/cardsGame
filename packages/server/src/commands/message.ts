import { Command, Targets } from "../command.js"
import type { Room } from "../room/base.js"
import type { State } from "../state/state.js"

/**
 * Sends message to single client
 */
export class Message<
  MessageTypes extends Record<string, unknown>
> extends Command {
  constructor(
    private clientID: string,
    private type: keyof MessageTypes,
    private message?: unknown
  ) {
    super()
  }

  async execute(state: State, room: Room<any>): Promise<void> {
    room.clientSend(this.clientID, this.type as string, this.message)
  }

  async undo(state: State, room: Room<any>): Promise<void> {
    room.clientSend(this.clientID, this.type as string, this.message, {
      undo: true,
    })
  }
}
