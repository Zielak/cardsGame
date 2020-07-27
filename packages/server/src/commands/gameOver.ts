import { Command } from "../command"
import { Room } from "../room"
import { State } from "../state/state"

export class GameOver extends Command {
  data: any

  constructor(data: any) {
    super()
    this.data = data
  }

  async execute(state: State, room: Room<any>): Promise<void> {
    state.isGameOver = true

    room.broadcast({
      type: "gameFinished",
      data: this.data,
    })
  }

  async undo(state: State, room: Room<any>): Promise<void> {
    state.isGameOver = false
  }
}
