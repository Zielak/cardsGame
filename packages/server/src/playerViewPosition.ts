import { Schema, type } from "@colyseus/schema"
import { def, limit } from "@cardsgame/utils"

export class PlayerViewPosition extends Schema implements IPlayerViewPosition {
  @type("string") alignX: "left" | "center" | "right"
  @type("string") alignY: "top" | "middle" | "bottom"
  @type("number") paddingX: number
  @type("number") paddingY: number

  constructor(options: IPlayerViewPosition = {}) {
    super()

    this.alignX = def(options.alignX, "center")
    this.alignY = def(options.alignY, "bottom")
    this.paddingX = def(limit(options.paddingX, 0, 100), 0)
    this.paddingY = def(limit(options.paddingY, 0, 100), -10)
  }
}
