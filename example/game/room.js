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

const { WarState } = require("./state")
const actions = require("./actions")
const botActivities = require("./bot")

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

    for (let [idx, player] of Object.entries(state.players)) {
      // Eeach player will has his own Container.
      const container = new Container(state, {
        owner: player,
        ownersMainFocus: true,
      })

      // Create a Deck to contain all player's cards
      decks.push(
        new Deck(state, {
          parent: container,
          name: "playersDeck",
        })
      )

      // A Pile container, to hold all currently played cards
      new Pile(state, { parent: container, y: -10 })

      state.playersPlayed[idx] = false
    }

    // Shuffle & Deal the cards
    return [
      new commands.ShuffleChildren(this.deck),
      new commands.DealCards(this.deck, decks),
    ]
  }

  onRoundStart() {
    const { state } = this

    for (let idx = 0; idx < state.playersPlayed.length; idx++) {
      state.playersPlayed[idx] = false
    }
  }

  onRoundEnd() {
    const { state } = this

    state.ante = Math.floor(state.round / 2)

    const someoneLost = state
      .queryAll({ name: "playersDeck" })
      .some((deck) => deck.countChildren() === 0)

    if (someoneLost) {
      state.isGameOver = true
      const winner = state
        .queryAll({ name: "playersDeck" })
        .find((deck) => deck.countChildren() > 0).owner

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
