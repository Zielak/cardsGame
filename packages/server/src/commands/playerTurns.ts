import { logs } from "@cardsgame/utils"

import { Command } from "../command"
import { State } from "../state"
import { Room } from "../room"

export class SetCurrentPlayer extends Command {
  private lastIdx: number
  constructor(private idx: number) {
    super()
  }

  async execute(state: State) {
    if (!state.turnBased)
      throw new Error(`Can't use SetCurrentPlayer in non turn based game.`)

    this.lastIdx = state.currentPlayerIdx
    state.currentPlayerIdx = this.idx
  }

  async undo(state: State) {
    state.currentPlayerIdx = this.lastIdx
  }
}

export class NextPlayer extends Command {
  async execute(state: State, room: Room<any>) {
    if (!state.turnBased)
      throw new Error(`Can't use NextPlayer in non turn based game.`)

    const current = state.currentPlayerIdx
    const next: number = current + 1 === state.playersCount ? 0 : current + 1

    // TODO: ignore the player who already finished playing

    const cmdsPre = room.onPlayerTurnEnded(state.currentPlayer)
    if (cmdsPre) {
      this.subExecute(state, room, new Command("onPlayerTurnEnded", cmdsPre))
    }

    this.subExecute(state, room, new SetCurrentPlayer(next))

    logs.notice(
      this.name,
      `now it's ${state.currentPlayer.clientID} player turn`
    )

    const cmdsPost = room.onPlayerTurnStarted(state.currentPlayer)
    if (cmdsPost) {
      this.subExecute(state, room, new Command("onPlayerTurnStarted", cmdsPost))
    }
  }
}

export class PreviousPlayer extends Command {
  async execute(state: State, room: Room<any>) {
    if (!state.turnBased)
      throw new Error(`Can't use PreviousPlayer in non turn based game.`)

    const current = state.currentPlayerIdx
    const next: number =
      current - 1 === -1 ? state.playersCount - 1 : current - 1

    const cmdsPre = room.onPlayerTurnEnded(state.currentPlayer)
    if (cmdsPre) {
      this.subExecute(state, room, new Command("onPlayerTurnEnded", cmdsPre))
    }

    this.subExecute(state, room, new SetCurrentPlayer(next))

    logs.notice(
      this.name,
      `now it's ${state.currentPlayer.clientID} player turn`
    )

    const cmdsPost = room.onPlayerTurnStarted(state.currentPlayer)
    if (cmdsPost) {
      this.subExecute(state, room, new Command("onPlayerTurnStarted", cmdsPost))
    }
  }
}
