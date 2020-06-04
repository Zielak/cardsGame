import { def } from "@cardsgame/utils"

import { State } from "../state/state"

export class TwoSidedTrait {
  /**
   * @memberof TwoSidedTrait
   */
  faceUp: boolean

  flip(): void {
    this.faceUp = !this.faceUp
  }

  flipUp(): void {
    this.faceUp = true
  }

  flipDown(): void {
    this.faceUp = false
  }
}

TwoSidedTrait["typeDef"] = {
  faceUp: "boolean",
}
TwoSidedTrait["trait"] = function constructorTwoSidedTrait(
  state: State,
  options: Partial<TwoSidedTrait>
): void {
  this.faceUp = def(options.faceUp, false)
}
