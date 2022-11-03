import { logs, def } from "@cardsgame/utils"
import { Schema } from "@colyseus/schema"

import { type } from "../annotations/type.js"

import { getRandomName } from "./names.js"

export class Player extends Schema implements IPlayerDefinition {
  /**
   * @category Player
   */
  @type("string") clientID: string
  /**
   * @category Player
   */
  @type("string") name: string

  /**
   * @category Player
   */
  @type("number") score = 0
  /**
   * @category Player
   */
  @type("number") timeLeft = -1

  constructor(options: PlayerOptions) {
    super()
    this.clientID = options.clientID
    this.name = def(options.name, getRandomName())

    logs.log("Player", `created new: "${this.clientID}", "${this.name}"`)
  }
}

export interface PlayerOptions {
  clientID: string
  name?: string
}
