import { TwoSidedTraitTypeDef } from "@cardsgame/entity-traits"
import { def } from "@cardsgame/utils"

import type { State } from "../state"

/**
 * Adds `faceUp` property and `flip*()` methods.
 * The entity now has two sides. Like a card or coin.
 * @category Trait
 */
export class TwoSidedTrait {
  /**
   * @category TwoSidedTrait
   */
  faceUp: boolean

  /**
   * Flip the entity on to the other side
   * @category TwoSidedTrait
   */
  flip(): void {
    this.faceUp = !this.faceUp
  }

  /**
   * Flip the entity to reveal its face
   * @category TwoSidedTrait
   */
  flipUp(): void {
    this.faceUp = true
  }

  /**
   * Flip the entity to reveal its back side
   * @category TwoSidedTrait
   */
  flipDown(): void {
    this.faceUp = false
  }
}

TwoSidedTrait["typeDef"] = TwoSidedTraitTypeDef
TwoSidedTrait["trait"] = function constructTwoSidedTrait(
  state: State,
  options: Partial<TwoSidedTrait>
): void {
  this.faceUp = def(options.faceUp, false)
}
