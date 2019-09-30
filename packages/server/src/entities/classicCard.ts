import { type } from "@colyseus/schema"
import { def, logs } from "@cardsgame/utils"
import {
  canBeChild,
  TwoSidedTrait,
  LabelTrait,
  Entity,
  applyMixins
} from "../traits"
import { LocationTrait } from "../traits/location"
import { ChildTrait } from "../traits/child"
import { State } from "../state"

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
//   logs.notice("faceDownOnlyOwner", this.name, ":", value)
//   // 1. To everyone only if it's faceUp
//   // 2. To owner, only if it's in his hands
//   return (
//     this.faceUp ||
//     (getOwner(this).clientID === (client as Client).id &&
//       getParentEntity(this).type === "hand")
//   )
// }

@canBeChild
export class ClassicCard extends Entity<ClassicCardOptions> {
  // My own props
  // @filter(faceDownOnlyOwner)
  @type("string")
  suit: string

  // @filter(faceDownOnlyOwner)
  @type("string")
  rank: string

  constructor(state: State, options: ClassicCardOptions = {}) {
    super(state, options)
    this.suit = def(options.suit, "X")
    this.rank = def(options.rank, "Y")
    this.name = options.suit + options.rank
    this.faceUp = def(options.faceUp, false)
  }
}

interface Mixin extends LocationTrait, ChildTrait, TwoSidedTrait, LabelTrait {}

type ClassicCardOptions = Partial<
  ConstructorType<Mixin> & {
    suit: string
    rank: string
  }
>

export interface ClassicCard extends ClassicCardOptions {}

applyMixins(ClassicCard, [LocationTrait, ChildTrait, TwoSidedTrait, LabelTrait])

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
      ...ranks.reduce((prevR, rank) => [...prevR, { suit, rank }], [])
    ],
    []
  )

  logs.notice(`created a deck of ${cards.length} cards`)

  return cards
}
