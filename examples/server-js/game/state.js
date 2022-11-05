const { State, defineTypes } = require("@cardsgame/server")
const { MapSchema } = require("@colyseus/schema")

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
