import { def } from "@cardsgame/utils"

import { State } from "../state"

export class TwoSidedTrait {
  faceUp: boolean

  flip() {
    this.faceUp = !this.faceUp
  }

  flipUp() {
    this.faceUp = true
  }

  flipDown() {
    this.faceUp = false
  }
}

;(TwoSidedTrait as any).typeDef = {
  faceUp: "boolean"
}
;(TwoSidedTrait as any).trait = function TwoSidedTrait(
  state: State,
  options: Partial<TwoSidedTrait>
) {
  this.faceUp = def(options.faceUp, false)
}
