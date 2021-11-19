import { Command } from "../command"
import type { Room } from "../room"
import type { State } from "../state"

export class GameOver extends Command {
  data: any

  constructor(data: any) {
    super()
    this.data = data
  }

  async execute(state: State, room: Room<any>): Promise<void> {
    state.isGameOver = true

    room.broadcast("gameFinished", this.data)
  }

  async undo(state: State, room: Room<any>): Promise<void> {
    state.isGameOver = false
  }
}
