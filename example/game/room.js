const cardsGameServer = require("@cardsgame/server")
const {
  commands,
  standardDeckFactory,
  Container,
  ClassicCard,
  Deck,
  Pile,
  Room,
} = cardsGameServer

const { WarState } = require("./state")
const actions = require("./actions")

class WarGame extends Room {
  constructor(options) {
    super(options)
    this.maxClients = 2
    this.possibleActions = new Set(actions)
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
    return this.state.clientsCount === 2
  }

  onStartGame() {
    const { state, commandsManager } = this

    // Prepare all (both) players
    const decks = []

    for (let [idx, player] of Object.entries(state.players)) {
      // Eeach player will has his own Container.
      const container = new Container(state, {
        owner: player,
        isInOwnersView: true,
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
    commandsManager.execute(state, new commands.ShuffleChildren(this.deck))
    commandsManager.execute(state, new commands.DealCards(this.deck, decks))
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

    const winningDeck = state
      .queryAll({ name: "playersDeck" })
      .find((deck) => deck.countChildren() === 0)

    if (winningDeck) {
      state.isGameOver = true
      this.broadcast({
        type: "gameOver",
        data: {
          winner: winningDeck.getOwner().clientID,
        },
      })
    }
  }
}

// Just to help out your IDE with auto completion on State
/** @type {WarState} */
WarGame.prototype.state = {}

module.exports = { WarGame }
