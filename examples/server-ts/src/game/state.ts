import { State, type, standardDeckFactory, entities } from "@cardsgame/server"
import { MapSchema } from "@colyseus/schema"

/**
 * Extracted as separate function and returning the state only for ease of testing.
 */
export function setupState(state: WarState): WarState {
  const deck = new entities.Deck(this, {
    name: "mainDeck",
    x: 50,
  })
  new entities.Pile(this, {
    name: "mainPile",
  })
  standardDeckFactory().forEach(
    (data) =>
      new entities.ClassicCard(this, {
        parent: deck,
        suit: data.suit,
        rank: data.rank,
      })
  )

  return state
}

type WarVariants = {
  anteRatio: number
}

export class WarState extends State<WarVariants> {
  /**
   * Marks which player made their calls
   */
  @type({ map: "boolean" }) playersPlayed: MapSchema<boolean> = new MapSchema()
  @type("boolean") isAtWar = false
  @type("uint8") ante = 0

  constructor(options) {
    super(options)

    // Override state's defaults
    this.turnBased = false

    setupState(this)
  }
}
