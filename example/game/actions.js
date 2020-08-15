const {
  commands,
  Conditions,
  getPlayersIndex,
  Player,
} = require("@cardsgame/server")

const { WarState } = require("./state")
const { MarkPlayerPlayed, Battle, ResetPlayersPlayed } = require("./commands")

/**
 * Ante is optional, and won't be added in early stages of the game
 * @param {WarState} state
 * @param {ServerPlayerMessage} event
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
    ante && new commands.ChangeParent(ante, pile),
    new commands.ChangeParent(card, pile),
    new commands.FaceUp(card),
  ])
}

const PickCard = {
  name: "PickCard",
  /**
   * @param {Player} player
   */
  interaction: (player) => [
    {
      type: "deck",
      name: "playersDeck",
      owner: player,
    },
  ],
  /**
   * @param {Conditions<WarState>} con
   */
  conditions: (con) => {
    // Get the index of currently acting player
    const currentPlayerIdx = getPlayersIndex(
      con().grabState(),
      con().grab("player")
    )

    // Current player didn't pick yet
    con().its("playersPlayed").nthChild(currentPlayerIdx).equals(false)
  },
  /**
   * @param {WarState} state
   * @param {ServerPlayerMessage} event
   */
  command: (state, event) => {
    // There's exactly one last player who didn't pick yet
    const isLastToPick =
      state.playersPlayed.filter((val) => val === false).length === 1

    const roundFinishingCommands = isLastToPick
      ? [
          new Battle(),
          new commands.Wait(1000),
          new ResetPlayersPlayed(),
          new commands.NextRound(),
        ]
      : []

    return new commands.Sequence("PickCard", [
      PlayCardWithAnte(state, event),
      ...roundFinishingCommands,
    ])
  },
}

module.exports = [PickCard]

module.exports.PickCard = PickCard
