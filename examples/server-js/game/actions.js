const { commands, entities, defineEntityAction } = require("@cardsgame/server")

const { MarkPlayerPlayed, Battle, ResetPlayersPlayed } = require("./commands")
const { WarState } = require("./state")

/**
 * This comment block enables autocompletion and suggestions
 * for ActionTemplate in JS projects. Neat!
 * @type {import("@cardsgame/server").EntityActionDefinition<WarState>}
 */
const PickCard = defineEntityAction({
  name: "PickCard",
  interaction: ({ player }) => [
    {
      type: "deck",
      owner: player,
    },
  ],
  conditions: (test, { state, player, variant }) => {
    const playerSessionID = player.clientID
    console.log("playerSessionID:", playerSessionID)
    console.log("state.playersPlayed:", [...state.playersPlayed.entries()])

    // Current player didn't pick yet
    test().its("playersPlayed").defined()
    test().its("playersPlayed").its(playerSessionID).equals(false)
  },
  command: ({ state, player }) => {
    const container = state.query({ owner: player })
    /** @type {entities.Deck} */
    const deck = container.query({ type: "deck" })
    console.log("deck has", deck.childCount, "children")
    /** @type {entities.Pile} */
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
      new MarkPlayerPlayed(player.clientID),
      new commands.ChangeParent(cards, pile),
      new commands.FaceUp(topCard),
      ...roundFinishingCommands,
    ])
  },
})

module.exports = [PickCard]

module.exports.PickCard = PickCard
