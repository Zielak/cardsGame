import { def } from "@cardsgame/utils"

import type { ChildTrait } from "@/traits/child.js"

import type { PlayerOptions } from "../player.js"

export class Player {
  clientID: string
  name: string

  score = 0
  timeLeft = -1

  dragStartEntity: ChildTrait
  isTapDragging = false

  constructor(options: PlayerOptions) {
    this.clientID = options.clientID
    this.name = def(options.name, "FOO")
  }
}
