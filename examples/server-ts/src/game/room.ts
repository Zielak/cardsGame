import { commands, entities, defineRoom } from "@cardsgame/server"

import { PickCard } from "./actions"
import { JustPlayGoal } from "./bot"
import { WarState } from "./state"

export const WarGame = defineRoom<WarState>("WarGame", {
  stateConstructor: WarState,
  variantDefaults: {
    anteRatio: 0.5,
  },

  maxClients: 2,
  possibleActions: [PickCard],
  botActivities: new Set([JustPlayGoal]),

  canGameStart() {
    return this.allClientsCount === 2
  },

  onStartGame() {
    const { state } = this

    const mainDeck = state.query<entities.Deck>({ name: "mainDeck" })

    // Prepare all (both) players
    const decks = []

    state.players.forEach((player, idx) => {
      // Eeach player will has his own Container.
      const container = new entities.Container(state, {
        owner: player,
        ownersMainFocus: true,
      })

      // Create a Deck to contain all player's cards
      decks.push(
        new entities.Deck(state, {
          parent: container,
          name: `player${player.name}Deck`,
        }),
      )

      // A Pile container, to hold all currently played cards
      new entities.Pile(state, { parent: container, y: -10 })

      state.playersPlayed.set(player.clientID, false)
    })

    // Shuffle & Deal the cards
    return [
      new commands.ShuffleChildren(mainDeck),
      new commands.DealCards(mainDeck, decks),
    ]
  },

  onRoundStart() {
    const { state } = this

    state.players.forEach((player, idx) => {
      state.playersPlayed.set(player.clientID, false)
    })
  },

  onRoundEnd() {
    const { state } = this

    state.ante = Math.floor(state.round * state.variantData.anteRatio)

    const playersDecks = state
      .queryAll<entities.Deck>({ type: "deck" })
      .filter((deck) => deck.owner !== undefined)

    const someoneLost = playersDecks.some((deck) => deck.countChildren() === 0)

    if (someoneLost) {
      state.isGameOver = true
      const winner = playersDecks.find((deck) => deck.countChildren() > 0).owner

      this.broadcast("gameOver", {
        winner: winner.clientID,
      })
    }
  },
})
