const { commands, Conditions } = require("@cardsgame/server")

const { WarState } = require("./state")
const { MarkPlayerPlayed, Battle, ResetPlayersPlayed } = require("./commands")

/**
 * @param {WarState} state
 * @param {ServerPlayerEvent} event
 */
const PlayCardWithAnte = (state, event) => {
  const container = state.query({ owner: event.player })
  const deck = container.query({ type: "deck" })
  const pile = container.query({ type: "pile" })

  const ante =
    state.ante > 0 ? deck.getChildren().splice(-state.ante - 1, state.ante) : []
  const card = deck.getTop()

  return [
    new MarkPlayerPlayed(state.getPlayersIndex(event.player)),
    new commands.ChangeParent(ante, pile),
    new commands.ChangeParent(card, pile),
    new commands.FaceUp(card),
  ]
}

const PickCard = {
  name: "PickCard",
  description: `Player picks a card from his deck, while other didn't choose yet`,
  getInteractions: () => [
    {
      type: "deck",
      name: "playersDeck",
    },
  ],
  /**
   * @param {Conditions<WarState>} con
   */
  getConditions: (con) => {
    // Player is interacting with his own Deck
    con.is.owner

    // Both players didn't chose their cards yet
    con.state.its("playersPlayed").each((con) => {
      con.equals(false)
    })
  },

  getCommands: PlayCardWithAnte,
}

const PickCardLast = {
  name: "PickCardLast",
  description: `Player is the last one to pick a card. Some calculations will follow.`,
  getInteractions: () => [
    {
      type: "deck",
      name: "playersDeck",
    },
  ],
  /**
   * @param {Conditions<WarState>} con
   */
  getConditions: (con) => {
    // Player is interacting with his own Deck
    con.is.owner

    // There's exactly one last player who didn't pick yet
    con
      .set(con.getState().playersPlayed.filter((val) => val === false).length)
      .equals(1)

    // Get the index of currently acting player
    const currentPlayerIdx = con.getState().getPlayersIndex(con.getPlayer())

    // Current player is the one who didn't pick yet
    con.state.its("playersPlayed").nthChild(currentPlayerIdx).equals(false)
  },

  /**
   * @param {WarState} state
   * @param {ServerPlayerEvent} event
   */
  getCommands: (state, event) => {
    return [
      ...PlayCardWithAnte(state, event),
      new Battle(),
      new ResetPlayersPlayed(),
    ]
  },
}

module.exports = [PickCard, PickCardLast]
