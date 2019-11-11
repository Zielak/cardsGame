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
  async execute(state) {
    // TODO: maybe prepare it for more than 2 players setup?

    const containerA = state.find({
      type: "container",
      owner: state.players[0]
    })
    const containerB = state.find({
      type: "container",
      owner: state.players[1]
    })

    const containers = [containerA, containerB]

    const topA = containerA.find({ type: "pile" }).getTop()
    const topB = containerB.find({ type: "pile" }).getTop()

    const data = {
      outcome: "",
      winner: undefined,
      loser: undefined
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

    logs.notice("Battle outcome:", data)

    if (data.outcome === "tie") {
      const result = [
        new commands.Broadcast({ type: "battleResult", data }),
        new commands.Wait(500)
      ]

      containers.forEach(container => {
        const card = container.find({ type: "deck" }).getTop()
        result.push(
          new commands.FaceDown(card),
          new commands.ChangeParent(card, container.find({ type: "pile" }))
        )
      })

      return result
    } else {
      const losersCards = state
        .find({ ownerID: data.loser }, { type: "pile" })
        .getChildren()
      logs.verbose("losersCards:", losersCards)

      const winnersCards = state
        .find({ ownerID: data.winner }, { type: "pile" })
        .getChildren()
      logs.verbose("winnersCards:", winnersCards)

      const winnersDeck = state.find({ ownerID: data.winner }, { type: "deck" })

      return [
        new commands.Broadcast({ type: "battleResult", data }),
        new commands.Wait(1000),
        new commands.FaceUp([...losersCards, ...winnersCards]),
        new commands.ChangeParent(
          [...losersCards, ...winnersCards],
          winnersDeck,
          true
        ),
        new commands.NextRound()
      ]
    }
  }
}
