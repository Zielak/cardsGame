const { commands, Conditions, Deck } = require("@cardsgame/server")

const { WarState } = require("./state")
const { MarkPlayerPlayed, Battle } = require("./commands")

const PickCard = {
  name: "PickCard",
  description: `Player picks a card from his deck, while other didn't choose yet`,
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
    // Player is interacting with his own Deck
    con.is.owner

    // Both players didn't chose their cards yet
    con.state.its("playersPlayed").each(con => {
      con.equals(false)
    })
  },

  /**
   * @param {WarState} state
   * @param {ServerPlayerEvent} event
   */
  getCommands: (state, event) => {
    const container = state.find({ owner: event.player })
    const deck = container.find({ type: "deck" })
    const pile = container.find({ type: "pile" })

    return [
      new MarkPlayerPlayed(state.getPlayersIndex(event.player)),
      new commands.ChangeParent(deck.getTop(), pile)
    ]
  }
}

const PickCardLast = {
  name: "PickCardLast",
  description: `Player is the last one to pick a card. Some calculations will follow.`,
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
    // Player is interacting with his own Deck
    con.is.owner

    // There's exactly one last player who didn't pick yet
    con
      .set(con.getState().playersPlayed.filter(val => val === false).length)
      .equals(1)

    // Get the index of currently acting player
    const currentPlayerIdx = con.getState().getPlayersIndex(con.getPlayer())

    // Current player is the one who didn't pick yet
    con.state
      .its("playersPlayed")
      .nthChild(currentPlayerIdx)
      .equals(false)
  },

  /**
   * @param {WarState} state
   * @param {ServerPlayerEvent} event
   */
  getCommands: (state, event) => {
    const container = state.find({ owner: event.player })
    const deck = container.find({ type: "deck" })
    const pile = container.find({ type: "pile" })

    return [
      new MarkPlayerPlayed(state.getPlayersIndex(event.player)),
      new commands.ChangeParent(deck.getTop(), pile),
      new Battle()
    ]
  }
}

module.exports = [PickCard, PickCardLast]
