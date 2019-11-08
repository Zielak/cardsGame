import { logs } from "@cardsgame/utils"
import { ICommand } from "."
import { State } from "../state"
import { Room } from "../room"

export class NextPlayer implements ICommand {
  execute(state: State, room: Room<any>) {
    if (state.turnBased)
      throw new Error(`Can't use NextPlayer in non turn based game.`)

    const _ = this.constructor.name
    const current = state.currentPlayerIdx
    const next: number = current + 1 === state.playersCount ? 0 : current + 1

    // TODO: ignore the player who already finished playing

    room.onPlayerTurnEnded(state.currentPlayer)

    state.currentPlayerIdx = next
    logs.notice(_, `now it's ${state.currentPlayer.clientID} player turn`)
    room.onPlayerTurnStarted(state.currentPlayer)
  }
}
