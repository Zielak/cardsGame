import { def, logs } from "@cardsgame/utils"

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

/**
 * Visibility filter
 * @param my
 * @param client
 */
// export function faceDownOnlyOwner(
//   this: Schema & IClassicCard,
//   client: any,
//   value: any
// ): boolean {
//   logs.log("faceDownOnlyOwner", this.name, ":", value)
//   // 1. To everyone only if it's faceUp
//   // 2. To owner, only if it's in his hands
//   return (
//     this.faceUp ||
//     (owner.clientID === (client as Client).id &&
//       getParentEntity(this).type === "hand")
//   )
// }

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
   * @memberof ClassicCard
   */
  @type("string") suit: string

  // @filter(faceDownOnlyOwner)
  /**
   * @memberof ClassicCard
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

/**
 * Will generate an array of card options.
 * Use this array to create actual cards yourself
 * @example
 * standardDeckFactory().map(options => {
 *   new ClassicCard({state, ...options})
 * })
 * @param ranks array of desired ranks
 * @param suits array of desired suits
 */
export const standardDeckFactory = (
  // prettier-ignore
  ranks: string[] = [
    "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"
  ],
  suits: string[] = ["H", "S", "C", "D"]
): ClassicCard[] => {
  const cards: ClassicCard[] = suits.reduce(
    (prevS, suit) => [
      ...prevS,
      ...ranks.reduce((prevR, rank) => [...prevR, { suit, rank }], []),
    ],
    []
  )

  logs.log(`created a deck of ${cards.length} cards`)

  return cards
}
