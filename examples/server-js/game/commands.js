const { commands, Command } = require("@cardsgame/server")

const { WarState } = require("./state")
const { sortRank } = require("./utils")

module.exports.MarkPlayerPlayed = class MarkPlayerPlayed extends Command {
  /** @param {string} playerClientID */
  constructor(playerClientID) {
    super("MarkPlayerPlayed")
    this.playerClientID = playerClientID
  }

  /** @param {WarState} state */
  async execute(state) {
    state.playersPlayed.set(this.playerClientID, true)
  }

  /** @param {WarState} state */
  async undo(state) {
    state.playersPlayed.set(this.playerClientID, false)
  }
}

module.exports.ResetPlayersPlayed = class ResetPlayersPlayed extends Command {
  constructor() {
    super("ResetPlayersPlayed")
    this.memory = new Map()
  }

  /** @param {WarState} state */
  async execute(state) {
    state.players.forEach((player) => {
      this.memory.set(player.clientID, state.playersPlayed.get(player.clientID))
      state.playersPlayed.set(player.clientID, false)
    })
  }

  /** @param {WarState} state */
  async undo(state) {
    state.players.forEach((player) => {
      state.playersPlayed.set(player.clientID, this.memory.get(player.clientID))
    })
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
