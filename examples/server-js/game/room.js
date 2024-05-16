const { commands, entities, defineRoom } = require("@cardsgame/server")

const actions = require("./actions")
const botActivities = require("./bot")
const { WarState } = require("./state")

const { Container, Deck, Pile } = entities

const WarGame = defineRoom("WarGame", {
  stateConstructor: WarState,
  variantsConfig: {
    defaults: {
      anteStart: 0,
      anteRatio: 0.5,
    },
  },
  maxClients: 2,
  possibleActions: actions,
  botActivities: new Set(botActivities),

  canGameStart() {
    return this.allClientsCount === 2
  },

  onStartGame() {
    const { state } = this

    state.ante = state.variantData.anteStart

    const mainDeck = state.query({ name: "mainDeck" })

    // Prepare all (both) players
    const decks = []

    state.players.forEach((player, idx) => {
      // Each player will has his own Container.
      const container = new Container(state, {
        owner: player,
        ownersMainFocus: true,
      })

      // Create a Deck to contain all player's cards
      decks.push(
        new Deck(state, {
          parent: container,
          name: `player${player.name}Deck`,
        }),
      )

      // A Pile container, to hold all currently played cards
      new Pile(state, { parent: container, y: -10 })

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

    state.ante =
      Math.floor(state.round * state.variantData.anteRatio) +
      state.variantData.anteStart

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
  },
})

// Just to help out your IDE with auto completion on State
/** @type {WarState} */
WarGame.prototype.state = {}

module.exports = { WarGame }
