import { def } from "@cardsgame/utils"

import { canBeChild } from "../annotations/canBeChild.js"
import { type } from "../annotations/type.js"
import type { State } from "../state/state.js"
import { ChildTrait } from "../traits/child.js"
import { applyTraitsMixins, Entity } from "../traits/entity.js"
import { IdentityTrait } from "../traits/identity.js"
import { LabelTrait } from "../traits/label.js"
import { LocationTrait } from "../traits/location.js"
import { OwnershipTrait } from "../traits/ownership.js"
import { TwoSidedTrait } from "../traits/twoSided.js"

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
 * Just a classic card.
 *
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
export class ClassicCard<
  S extends Suit = Suit,
  R extends Rank = Rank
> extends Entity<ClassicCardOptions<S, R>> {
  // @filter(faceDownOnlyOwner)
  /**
   * @category ClassicCard
   */
  @type("string") suit: S

  // @filter(faceDownOnlyOwner)
  /**
   * @category ClassicCard
   */
  @type("string") rank: R

  create(state: State, options: ClassicCardOptions<S, R> = {}): void {
    this.suit = def(options.suit, "X" as S)
    this.rank = def(options.rank, "Y" as R)
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

type ClassicCardOptions<S, R> = Partial<
  NonFunctionProperties<Mixin> & {
    suit: S
    rank: R
  }
>

export interface ClassicCard extends Mixin {}
