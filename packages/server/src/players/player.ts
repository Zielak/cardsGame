import { def, logs } from "@cardsgame/utils"
import { Schema } from "@colyseus/schema"

import { type } from "../annotations/type"

import { getRandomName } from "./names"

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

// Event from client, with stuff auto filled when coming to server
export type ServerPlayerMessage = ClientPlayerMessage & {
  /**
   * Player who initiated interaction on client-side
   */
  player?: Player
  /**
   * An Entity which was interactd with
   */
  entity?: unknown
  /**
   * List of all interactable parents, starting with target entity, finishing with the most distant parent
   */
  entities?: unknown[]
  /**
   * It's the time when the message has arrived to the server
   */
  timestamp: number
}
