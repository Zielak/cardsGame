const { State, defineTypes, ArraySchema } = require("@cardsgame/server")

class WarState extends State {
  constructor() {
    super()

    // Override state's defaults
    this.turnBased = false

    // New, custom state properties

    /** @type {boolean} */
    this.isAtWar = false

    /** @type {boolean[]} */
    this.playersPlayed = new ArraySchema()
  }
}

/**
 * Makes sure these props are synchronizable with the client
 * and of a specific type.
 */
defineTypes(WarState, {
  isAtWar: "boolean",
  playersPlayed: ["boolean"]
})

module.exports = { WarState }
