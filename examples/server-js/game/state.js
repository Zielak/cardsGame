const {
  State,
  defineTypes,
  standardDeckFactory,
  entities,
} = require("@cardsgame/server")
const { MapSchema } = require("@colyseus/schema")

const { ClassicCard, Deck, Pile } = entities

function setupState(state) {
  const deck = new Deck(state, {
    name: "mainDeck",
    x: 50,
  })
  pile = new Pile(state, {
    name: "mainPile",
  })
  standardDeckFactory().forEach(
    (data) =>
      new ClassicCard(state, {
        parent: deck,
        suit: data.suit,
        rank: data.rank,
      }),
  )
}

class WarState extends State {
  constructor() {
    super()

    // Override state's defaults
    this.turnBased = false

    // New, custom state properties

    /** @type {boolean} */
    this.isAtWar = false

    /** @type {Map<string, boolean>} */
    this.playersPlayed = new MapSchema()

    /** @type {number} */
    this.ante = 0

    setupState(this)
  }
}

/**
 * Makes sure these props are synchronizable with the client
 * and of a specific type.
 */
defineTypes(WarState, {
  isAtWar: "boolean",
  playersPlayed: { map: "boolean" },
  ante: "number",
})

module.exports = { WarState }
