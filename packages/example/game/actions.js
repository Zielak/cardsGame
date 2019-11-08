const { commands, Conditions, Deck } = require("@cardsgame/server")

const { WarState } = require("./state")
const { MarkPlayerPlayed } = require("./commands")

const PickCard = {
  name: "PickCard",
  description: `Player picks a card from his deck`,
  getInteractions: () => [
    {
      type: "deck",
      name: "playersDeck"
    }
  ],
  /**
   * @param {Conditions<WarState>} con
   */
  getConditions: con => {
    // Get the index of currently acting player
    const currentPlayerIdx = con.getState().getPlayersIndex(con.getPlayer())

    // Find out if this player already
    // picked his card for this round
    con.state
      .its("playersPlayed")
      .nthChild(currentPlayerIdx)
      .is(false)
  },

  /**
   * @param {WarState} state
   * @param {ServerPlayerEvent} event
   */
  getCommands: (state, event) => {
    const container = state.find({ owner: event.player })
    const deck = container.find({ type: "deck" })
    const hand = container.find({ type: "hand" })

    // Did other players finished picking cards?
    if (state.playersPlayed.every(value => value === true)) {
    }

    return [
      new MarkPlayerPlayed(state.getPlayersIndex(event.player)),
      new commands.ChangeParent(deck.getTop(), deck, hand)
    ]
  }
}

module.exports = { PickCard }
