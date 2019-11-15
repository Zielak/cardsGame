import { logs } from "@cardsgame/utils"
import { Command } from "../command"
import { State } from "../state"
import { Room } from "../room"

export class PreviousPlayer extends Command {
  _name = "PreviousPlayer"

  async execute(state: State, room: Room<any>) {
    if (state.turnBased)
      throw new Error(`Can't use PreviousPlayer in non turn based game.`)

    const _ = this.constructor.name
    const current = state.currentPlayerIdx
    const next: number =
      current - 1 === -1 ? state.playersCount - 1 : current - 1

    room.onPlayerTurnEnded(state.currentPlayer)

    state.currentPlayerIdx = next
    logs.notice(_, `now it's ${state.currentPlayer.clientID} player turn`)
    room.onPlayerTurnStarted(state.currentPlayer)
  }
}
