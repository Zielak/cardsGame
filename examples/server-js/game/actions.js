const { commands, Pile, Deck } = require("@cardsgame/server")

const { MarkPlayerPlayed, Battle, ResetPlayersPlayed } = require("./commands")
const { WarState } = require("./state")

/**
 * This comment block enables autocompletion and suggestions
 * for ActionTemplate in JS projects. Neat!
 * @type {import("@cardsgame/server").ActionTemplate<WarState>}
 */
const PickCard = {
  name: "PickCard",
  interaction: (player) => [
    {
      type: "deck",
      owner: player,
    },
  ],
  conditions: (con) => {
    const playerSessionID = con().ref.player.grab().clientID
    console.log("playerSessionID:", playerSessionID)
    console.log("state.playersPlayed:", [
      ...con().grabState().playersPlayed.entries(),
    ])

    // Current player didn't pick yet
    con().its("playersPlayed").defined()
    con().its("playersPlayed").its(playerSessionID).equals(false)
  },
  command: (state, event) => {
    const container = state.query({ owner: event.player })
    /** @type {Deck} */
    const deck = container.query({ type: "deck" })
    console.log("deck has", deck.childCount, "children")
    /** @type {Pile} */
    const pile = container.query({ type: "pile" })

    const count = state.ante + 1
    console.log("picking up", count, "cards")
    const cards = deck.getChildren().splice(-count)
    console.log("actually picked up", cards.length)
    const topCard = cards[cards.length - 1]
    console.log(`topCard: ${topCard.idx}:${topCard.name}`)

    // There's exactly one last player who didn't pick yet
    const isLastToPick =
      [...state.playersPlayed.values()].filter((val) => val === false)
        .length === 1

    const roundFinishingCommands = isLastToPick
      ? [
          new Battle(),
          new commands.Wait(1000),
          new ResetPlayersPlayed(),
          new commands.NextRound(),
        ]
      : []

    return new commands.Sequence("PickCard", [
      new MarkPlayerPlayed(event.player.clientID),
      new commands.ChangeParent(cards, pile),
      new commands.FaceUp(topCard),
      ...roundFinishingCommands,
    ])
  },
}

module.exports = [PickCard]

module.exports.PickCard = PickCard
