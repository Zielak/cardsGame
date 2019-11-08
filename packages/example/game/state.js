const { State, defineTypes, ArraySchema } = require("@cardsgame/server")

class WarState extends State {
  constructor(options) {
    super(options)
    /** @type {boolean} */
    this.isAtWar = false

    /** @type {boolean[]} */
    this.playersPlayed = new ArraySchema()
  }
}

defineTypes(WarState, {
  isAtWar: "boolean",
  playersPlayed: ["boolean"]
})

module.exports = { WarState }
