const {
  commands,
  InteractionConditions,
  getPlayersIndex,
} = require("@cardsgame/server")

const { WarState } = require("./state")
const { MarkPlayerPlayed, Battle, ResetPlayersPlayed } = require("./commands")

/**
 * Ante is optional, and won't be added in early stages of the game
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

  return new commands.Sequence("PlayCardWithAnte", [
    new MarkPlayerPlayed(getPlayersIndex(state, event.player)),
    new commands.ChangeParent(ante, pile),
    new commands.ChangeParent(card, pile),
    new commands.FaceUp(card),
  ])
}

const PickCard = {
  name: "PickCard",
  description: `Player picks a card from his deck, while other didn't choose yet`,
  interactions: () => [
    {
      type: "deck",
      name: "playersDeck",
    },
  ],
  /**
   * @param {InteractionConditions<WarState>} con
   */
  checkConditions: (con) => {
    // Player is interacting with his own Deck
    con.playerOwnsThisEntity()

    // Both players didn't chose their cards yet
    con.state.its("playersPlayed").every((con) => {
      con.equals(false)
    })
  },
  getCommand: PlayCardWithAnte,
}

const PickCardLast = {
  name: "PickCardLast",
  description: `Player is the last one to pick a card. Some calculations will follow.`,
  interactions: () => [
    {
      type: "deck",
      name: "playersDeck",
    },
  ],
  /**
   * @param {InteractionConditions<WarState>} con
   */
  checkConditions: (con) => {
    // Player is interacting with his own Deck
    con.playerOwnsThisEntity()

    // Get the index of currently acting player
    const currentPlayerIdx = getPlayersIndex(con.getState(), con.getPlayer())

    // Current player didn't pick yet
    con.state.its("playersPlayed").nthChild(currentPlayerIdx).equals(false)

    // There's exactly one last player who didn't pick yet
    const coundDidntPick = con
      .getState()
      .playersPlayed.filter((val) => val === false).length

    con.set(coundDidntPick).equals(1)
  },

  /**
   * @param {WarState} state
   * @param {ServerPlayerEvent} event
   */
  getCommand: (state, event) => {
    return new commands.Sequence("PickCardLast", [
      PlayCardWithAnte(state, event),
      new Battle(),
      new commands.Wait(1000),
      new ResetPlayersPlayed(),
      new commands.NextRound(),
    ])
  },
}

module.exports = [PickCard, PickCardLast]
