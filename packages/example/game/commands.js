const { Room, commands } = require("@cardsgame/server")
const { WarState } = require("./state")
const { sortRank } = require("./utils")

class MarkPlayerPlayed {
  /** @param {number} playerIdx */
  constructor(playerIdx) {
    this.playerIdx = playerIdx
  }

  /** @param {WarState} state */
  execute(state) {
    state.playersPlayed[this.playerIdx] = true
  }

  /** @param {WarState} state */
  undo(state) {
    state.playersPlayed[this.playerIdx] = false
  }
}

class Battle {
  /**
   * @param {WarState} state
   * @param {Room} room
   */
  execute(state, room) {
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
      result: ""
    }

    const res = sortRank(topA.rank, topB.rank)
    if (res > 0) {
      data.result = "win"
      data.winner = state.players[0].clientID
      data.loser = state.players[1].clientID
    } else if (res < 0) {
      data.result = "win"
      data.winner = state.players[1].clientID
      data.loser = state.players[0].clientID
    } else {
      data.result = "tie"
    }

    if (data.result === "tie") {
      containers.forEach(container => {
        const card = container.find({ type: "deck" }).getTop()
        card.flipDown()

        new commands.ChangeParent(card, containerA.find({ type: "pile" }))
      })
    } else {
      new commands.NextRound().execute(state, room)
    }

    state.playersPlayed[0] = false
    state.playersPlayed[1] = false

    room.broadcast({ type: "battleResult", data })
  }
}

module.exports = {
  MarkPlayerPlayed,
  Battle
}
