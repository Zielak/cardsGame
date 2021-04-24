import { def, logs } from "@cardsgame/utils"
import { Schema } from "@colyseus/schema"

import { type } from "../annotations/type"

import { getRandomName } from "./names"

export class Player extends Schema {
  @type("string") clientID: string
  @type("string") name: string

  @type("number") score = 0
  @type("number") timeLeft = -1

  constructor(options: PlayerOptions) {
    super()
    this.clientID = options.clientID
    this.name = def(options.name, getRandomName())

    logs.notice("Player", `created new: "${this.clientID}", "${this.name}"`)
  }
}

export interface PlayerOptions {
  clientID: string
  name?: string
}

// Event from client, with stuff auto filled when coming to server
export type ServerPlayerMessage = ClientPlayerMessage & {
  player?: Player
  entity?: unknown
  entities?: unknown[]
  /**
   * It's the time when the message has arrived to the server
   */
  timestamp: number
}
