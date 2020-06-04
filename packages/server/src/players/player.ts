import { def, logs } from "@cardsgame/utils"
import { Schema } from "@colyseus/schema"

import { type } from "../annotations/type"
import { getRandomName } from "./names"

export class Player extends Schema {
  @type("string") clientID: string
  @type("string") name: string

  @type("number") score = 0
  @type("number") timeLeft = -1

  finishedPlaying = false

  constructor(options: PlayerOptions) {
    super()
    this.clientID = options.clientID
    this.name = def(options.name, getRandomName())

    logs.notice("Player()", `"${this.clientID}", "${this.name}"`)
  }
}

export interface PlayerOptions {
  clientID: string
  name?: string
}

// Event from client, with stuff auto filled when coming to server
export type ServerPlayerEvent = ClientPlayerEvent & {
  player?: Player
  entity?: unknown
  entities?: unknown[]
}
