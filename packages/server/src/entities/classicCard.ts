import { def } from "@cardsgame/utils"

import { canBeChild } from "../annotations/canBeChild"
import { type } from "../annotations/type"
import type { State } from "../state"
import { ChildTrait } from "../traits/child"
import { applyTraitsMixins, Entity } from "../traits/entity"
import { IdentityTrait } from "../traits/identity"
import { LabelTrait } from "../traits/label"
import { LocationTrait } from "../traits/location"
import { OwnershipTrait } from "../traits/ownership"
import { TwoSidedTrait } from "../traits/twoSided"

// /**
//  * Visibility filter
//  * @param my
//  * @param client
//  */
// export function faceDownOnlyOwner(
//   this: ClassicCard,
//   { sessionId },
//   value: any
// ): boolean {
//   logs.log("faceDownOnlyOwner", this.name, ":", value)
//   // 1. To everyone only if it's faceUp
//   // 2. To owner, only if it's in his hands
//   return this.faceUp || this.owner?.clientID === sessionId
// }

/**
 * @category Entity
 */
@canBeChild
@applyTraitsMixins([
  IdentityTrait,
  LocationTrait,
  ChildTrait,
  TwoSidedTrait,
  LabelTrait,
  OwnershipTrait,
])
export class ClassicCard extends Entity<ClassicCardOptions> {
  // @filter(faceDownOnlyOwner)
  /**
   * @category ClassicCard
   */
  @type("string") suit: string

  // @filter(faceDownOnlyOwner)
  /**
   * @category ClassicCard
   */
  @type("string") rank: string

  create(state: State, options: ClassicCardOptions = {}): void {
    this.suit = def(options.suit, "X")
    this.rank = def(options.rank, "Y")
    this.name = options.suit + options.rank
    this.type = "classicCard"
    this.faceUp = def(options.faceUp, false)
  }
}

interface Mixin
  extends IdentityTrait,
    LocationTrait,
    ChildTrait,
    TwoSidedTrait,
    LabelTrait,
    OwnershipTrait {}

type ClassicCardOptions = Partial<
  NonFunctionProperties<Mixin> & {
    suit: string
    rank: string
  }
>

export interface ClassicCard extends Mixin {}
