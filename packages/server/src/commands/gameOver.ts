import { Command } from "../command.js"
import type { Room } from "../room/base.js"
import type { State } from "../state/state.js"

export class GameOver<Data = any> extends Command {
  data: Data

  constructor(data: Data) {
    super()
    this.data = data
  }

  async execute(state: State, room: Room<any>): Promise<void> {
    state.isGameOver = true

    room.broadcast("gameFinished", this.data)
  }

  async undo(state: State, room: Room<any>): Promise<void> {
    state.isGameOver = false

    room.broadcast("gameFinished", this.data, { undo: true })
  }
}
