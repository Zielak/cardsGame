import { def } from "@cardsgame/utils"
import { Schema } from "@colyseus/schema"

import { type } from "./annotations/type"

export class PlayerViewPosition extends Schema implements IPlayerViewPosition {
  @type("string") alignX: "left" | "center" | "right"
  @type("string") alignY: "top" | "middle" | "bottom"
  @type("number") paddingX: number
  @type("number") paddingY: number

  constructor(options: IPlayerViewPosition = {}) {
    super()

    this.alignX = def(options.alignX, "center")
    this.alignY = def(options.alignY, "bottom")
    this.paddingX = def(options.paddingX, 0)
    this.paddingY = def(options.paddingY, 0)
  }
}
