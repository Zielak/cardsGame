import { logs, def } from "@cardsgame/utils"
import { Schema } from "@colyseus/schema"

import { type } from "../annotations/type.js"
import type { ChildTrait } from "../traits/child.js"

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
   * Utilize this in a time-sensitive game
   * @category Player
   */
  @type("number") timeLeft = -1

  /**
   * An entity with which dragging was started.
   *
   * Needs to be visible for Commands.
   * @ignore
   */
  dragStartEntity: ChildTrait

  /**
   * Is player currently using `tap` events to play a drag action?
   * (accessibility dragging fallback)
   */
  isTapDragging = false

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
