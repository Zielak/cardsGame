const { Player, BotConditions, getPlayersIndex } = require("@cardsgame/server")

const { WarState } = require("./state")

/**
 * @param {BotConditions<WarState>} con
 */
const conditionDidntYetPlay = (con) => {
  // Get the index of currently acting player
  const currentPlayerIdx = getPlayersIndex(con.getState(), con.getPlayer())

  con.state.its("playersPlayed").nthChild(currentPlayerIdx).equals(false)
}

const PlayMyCardAction = {
  name: "PlayMyCardAction",
  value: () => 1,
  condition: conditionDidntYetPlay,
  /**
   * Click your own deck
   * @param {WarState} state
   * @param {Player} player
   * @returns {BotPlayerEvent}
   */
  event: (state, player) => ({
    entity: state.query({ type: "deck", owner: player }),
  }),
}

const JustPlayGoal = {
  name: "JustPlayGoal",
  description: "Bot can take only one action in this game. Click the deck!",
  value: () => 1,
  condition: conditionDidntYetPlay,
  actions: new Set([PlayMyCardAction]),
}

module.exports = [JustPlayGoal]
