const { commands, Command } = require("@cardsgame/server")
const { logs } = require("@cardsgame/utils")
const { WarState } = require("./state")
const { sortRank } = require("./utils")

module.exports.MarkPlayerPlayed = class MarkPlayerPlayed extends Command {
  /** @param {number} playerIdx */
  constructor(playerIdx) {
    super("MarkPlayerPlayed")
    this.playerIdx = playerIdx
  }

  /** @param {WarState} state */
  async execute(state) {
    state.playersPlayed[this.playerIdx] = true
  }

  /** @param {WarState} state */
  async undo(state) {
    state.playersPlayed[this.playerIdx] = false
  }
}

module.exports.ResetPlayersPlayed = class ResetPlayersPlayed extends Command {
  constructor() {
    super("ResetPlayersPlayed")
    this.memory = []
  }

  /** @param {WarState} state */
  async execute(state) {
    for (let idx = 0; idx < state.playersCount; idx++) {
      this.memory[idx] = state.playersPlayed[idx]
      state.playersPlayed[idx] = false
    }
  }

  /** @param {WarState} state */
  async undo(state) {
    for (let idx = 0; idx < state.playersCount; idx++) {
      state.playersPlayed[idx] = this.memory[idx]
    }
  }
}

/**
 * @param {WarState} state
 */
module.exports.Battle = class Battle extends Command {
  constructor() {
    super("Battle")
  }
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

    const data = {
      outcome: "",
      winner: undefined,
      loser: undefined,
    }

    const res = sortRank(topA.rank, topB.rank)
    if (res > 0) {
      data.outcome = "win"
      data.winner = state.players[0].clientID
      data.loser = state.players[1].clientID
    } else if (res < 0) {
      data.outcome = "win"
      data.winner = state.players[1].clientID
      data.loser = state.players[0].clientID
    } else {
      data.outcome = "tie"
    }

    const subCommands = [
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
