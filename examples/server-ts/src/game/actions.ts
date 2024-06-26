import { commands, entities, defineEntityAction } from "@cardsgame/server"

import { MarkPlayerPlayed, Battle, ResetPlayersPlayed } from "./commands"
import { WarState } from "./state"

export const PickCard = defineEntityAction<WarState>({
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
    const container = state.query<entities.Container>({ owner: player })
    const deck = container.query<entities.Deck>({ type: "deck" })
    console.log("deck has", deck.childCount, "children")

    const pile = container.query<entities.Pile>({ type: "pile" })

    const count = state.ante + 1
    console.log("picking up", count, "cards")

    const cards = deck.getChildren<entities.ClassicCard>().splice(-count)
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
