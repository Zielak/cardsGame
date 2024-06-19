import { def } from "@cardsgame/utils"
import { Schema } from "@colyseus/schema"

import { type } from "@/annotations/type.js"

type GameClientOptions =
  | {
      id: string
      ready?: boolean
      isBot?: boolean
    }
  | string

export class GameClient extends Schema {
  @type("string") id: string
  @type("boolean") ready: boolean
  @type("boolean") isBot: boolean

  constructor(options: GameClientOptions) {
    super()

    if (typeof options === "string") {
      this.id = options
      this.ready = false
      this.isBot = false
    } else {
      this.id = options.id
      this.ready = def(options.ready, false)
      this.isBot = def(options.isBot, false)
    }
  }
}
