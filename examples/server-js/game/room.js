const cardsGameServer = require("@cardsgame/server")
const {
  commands,
  standardDeckFactory,
  Container,
  ClassicCard,
  Deck,
  Pile,
  Room,
  Bot,
} = cardsGameServer

const actions = require("./actions")
const botActivities = require("./bot")
const { WarState } = require("./state")

class WarGame extends Room {
  constructor(options) {
    super(options)
    this.maxClients = 2
    this.possibleActions = new Set(actions)
    this.botActivities = new Set(botActivities)
  }

  onInitGame() {
    this.setState(new WarState())

    const { state } = this

    this.deck = new Deck(state, {
      name: "mainDeck",
      x: 50,
    })
    this.pile = new Pile(state, {
      name: "mainPile",
    })
    standardDeckFactory().forEach(
      (data) =>
        new ClassicCard(state, {
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
      const container = new Container(state, {
        owner: player,
        ownersMainFocus: true,
      })

      // Create a Deck to contain all player's cards
      decks.push(
        new Deck(state, {
          parent: container,
          name: `player${player.name}Deck`,
        })
      )

      // A Pile container, to hold all currently played cards
      new Pile(state, { parent: container, y: -10 })

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
      .queryAll({ type: "deck" })
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

// Just to help out your IDE with auto completion on State
/** @type {WarState} */
WarGame.prototype.state = {}

module.exports = { WarGame }
