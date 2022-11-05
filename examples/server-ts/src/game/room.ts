import {
  commands,
  standardDeckFactory,
  entities,
  Room,
} from "@cardsgame/server"

import { PickCard } from "./actions"
import { JustPlayGoal } from "./bot"
import { WarState } from "./state"

export class WarGame extends Room<WarState> {
  // Just some quick references to basic entities
  deck: entities.Deck
  pile: entities.Pile

  constructor(options) {
    super(options)
    this.maxClients = 2
    this.possibleActions = new Set([PickCard])
    this.botActivities = [JustPlayGoal]
  }

  onInitGame() {
    this.setState(new WarState())

    const { state } = this

    this.deck = new entities.Deck(state, {
      name: "mainDeck",
      x: 50,
    })
    this.pile = new entities.Pile(state, {
      name: "mainPile",
    })
    standardDeckFactory().forEach(
      (data) =>
        new entities.ClassicCard(state, {
          parent: this.deck,
          suit: data.suit,
          rank: data.rank,
        })
    )
  }

  canGameStart() {
    return this.allClientsCount === 2
  }

  onStartGame() {
    const { state } = this

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
        })
      )

      // A Pile container, to hold all currently played cards
      new entities.Pile(state, { parent: container, y: -10 })

      state.playersPlayed.set(player.clientID, false)
    })

    // Shuffle & Deal the cards
    return [
      new commands.ShuffleChildren(this.deck),
      new commands.DealCards(this.deck, decks),
    ]
  }

  onRoundStart() {
    const { state } = this

    state.players.forEach((player, idx) => {
      state.playersPlayed.set(player.clientID, false)
    })
  }

  onRoundEnd() {
    const { state } = this

    state.ante = Math.floor(state.round / 2)

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
  }
}
