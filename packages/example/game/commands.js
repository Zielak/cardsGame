const { WarState } = require("./state")

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

module.exports = {
  MarkPlayerPlayed
}
