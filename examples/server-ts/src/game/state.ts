import { State, type } from "@cardsgame/server"
import { MapSchema } from "@colyseus/schema"

export class WarState extends State {
  @type("boolean") isAtWar = false
  @type({ map: "boolean" }) playersPlayed: MapSchema<boolean> = new MapSchema()
  @type("uint8") ante = 0

  constructor() {
    super()

    // Override state's defaults
    this.turnBased = false
  }
}
