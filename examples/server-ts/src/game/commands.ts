import { commands, Command } from "@cardsgame/server"

import { WarState } from "./state"
import { sortRank } from "./utils"

export class MarkPlayerPlayed extends Command<WarState> {
  constructor(private playerClientID: string) {
    super()
    this.playerClientID = playerClientID
  }

  async execute(state) {
    state.playersPlayed.set(this.playerClientID, true)
  }

  async undo(state) {
    state.playersPlayed.set(this.playerClientID, false)
  }
}

export class ResetPlayersPlayed extends Command<WarState> {
  private memory = new Map()

  async execute(state) {
    state.players.forEach((player) => {
      this.memory.set(player.clientID, state.playersPlayed.get(player.clientID))
      state.playersPlayed.set(player.clientID, false)
    })
  }

  async undo(state) {
    state.players.forEach((player) => {
      state.playersPlayed.set(player.clientID, this.memory.get(player.clientID))
    })
  }
}

export class Battle extends Command<WarState> {
  async execute(state, room) {
    // TODO: maybe prepare it for more than 2 players setup?
    const containerA = state.query({
      type: "container",
      owner: state.players[0],
    })
    const containerB = state.query({
      type: "container",
      owner: state.players[1],
    })

    const topA = containerA.query({ type: "pile" }).getTop()
    const topB = containerB.query({ type: "pile" }).getTop()

    const data: BattleResult = {
      outcome: "",
      winner: undefined,
      loser: undefined,
    }

    const result = sortRank(topA.rank, topB.rank)
    if (result > 0) {
      data.outcome = "win"
      data.winner = state.players[0].clientID
      data.loser = state.players[1].clientID
    } else if (result < 0) {
      data.outcome = "win"
      data.winner = state.players[1].clientID
      data.loser = state.players[0].clientID
    } else {
      data.outcome = "tie"
    }

    const subCommands: Command[] = [
      new commands.Broadcast("battleResult", data),
      new commands.Wait(500),
    ]

    if (data.outcome !== "tie") {
      const losersCards = state
        .query({
          type: "pile",
          parent: { ownerID: data.loser },
        })
        .getChildren()

      const winnersCards = state
        .query({
          type: "pile",
          parent: { ownerID: data.winner },
        })
        .getChildren()

      const winnersDeck = state.query({
        type: "deck",
        parent: { ownerID: data.winner },
      })

      subCommands.push(
        new commands.FaceDown([...losersCards, ...winnersCards]),
        new commands.ChangeParent(
          [...losersCards, ...winnersCards],
          winnersDeck,
          { prepend: true }
        )
      )
    }

    this.subExecute(
      state,
      room,
      new commands.Sequence("PostBattle", subCommands)
    )
  }
}
