import type { Room } from "@/room/base.js"
import { getNextPlayerIdx, getPreviousPlayerIdx } from "@/state/helpers.js"
import type { State } from "@/state/state.js"

import { Command } from "../command.js"
import { logs } from "../logs.js"

import { Sequence } from "./sequence.js"

export class NextPlayer extends Command {
  private lastIdx: number

  constructor() {
    super()
  }
  async execute(state: State, room: Room<any>): Promise<void> {
    if (!state.turnBased) {
      throw new Error(`Can't use NextPlayer in non turn based game.`)
    }

    const next = getNextPlayerIdx(state)

    // TODO: ignore the player who already finished playing

    const cmdsPre = room.onPlayerTurnEnded(state.currentPlayer)
    if (cmdsPre) {
      this.subExecute(state, room, new Sequence("onPlayerTurnEnded", cmdsPre))
    }

    this.lastIdx = state.currentPlayerIdx
    state.currentPlayerIdx = next

    logs.log(this.name, `now it's ${state.currentPlayer.clientID} player turn`)

    const cmdsPost = room.onPlayerTurnStarted(state.currentPlayer)
    if (cmdsPost) {
      this.subExecute(
        state,
        room,
        new Sequence("onPlayerTurnStarted", cmdsPost),
      )
    }

    room.botRunner?.onPlayerTurnStarted(state.currentPlayer)
  }
  async undo(state: State, room: Room<any>): Promise<void> {
    super.undo(state, room)
    state.currentPlayerIdx = this.lastIdx
  }
}

export class PreviousPlayer extends Command {
  private lastIdx: number

  constructor() {
    super()
  }
  async execute(state: State, room: Room<any>): Promise<void> {
    if (!state.turnBased) {
      throw new Error(`Can't use PreviousPlayer in non turn based game.`)
    }

    const previous = getPreviousPlayerIdx(state)

    const cmdsPre = room.onPlayerTurnEnded(state.currentPlayer)
    if (cmdsPre) {
      this.subExecute(state, room, new Sequence("onPlayerTurnEnded", cmdsPre))
    }

    this.lastIdx = state.currentPlayerIdx
    state.currentPlayerIdx = previous

    logs.log(this.name, `now it's ${state.currentPlayer.clientID} player turn`)

    const cmdsPost = room.onPlayerTurnStarted(state.currentPlayer)
    if (cmdsPost) {
      this.subExecute(
        state,
        room,
        new Sequence("onPlayerTurnStarted", cmdsPost),
      )
    }

    room.botRunner.onPlayerTurnStarted(state.currentPlayer)
  }
  async undo(state: State, room: Room<any>): Promise<void> {
    super.undo(state, room)
    state.currentPlayerIdx = this.lastIdx
  }
}
