import { BaseCard, IBaseCardOptions, faceDownOnlyOwner } from "./baseCard"
import { logs } from "../logs"
import { filter, type } from "@colyseus/schema"

export interface IClassicCardOptions extends IBaseCardOptions {
  suit: string
  rank: string
}

export class ClassicCard extends BaseCard {
  type = "classicCard"

  @filter(faceDownOnlyOwner)
  @type("string")
  name: string

  @filter(faceDownOnlyOwner)
  @type("string")
  suit: string

  @filter(faceDownOnlyOwner)
  @type("string")
  rank: string

  constructor(options: IClassicCardOptions) {
    super(options)

    this.suit = options.suit
    this.rank = options.rank
    this.name = this.rank + this.suit
  }
}

export const standardDeck = (
  // prettier-ignore
  ranks: string[] = [
    "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"
  ],
  suits: string[] = ["H", "S", "C", "D"]
): IClassicCardOptions[] => {
  const cards: IClassicCardOptions[] = suits.reduce(
    (prevS, suit) => [
      ...prevS,
      ...ranks.reduce((prevR, rank) => [...prevR, { suit, rank }], [])
    ],
    []
  )

  logs.verbose(`created a deck of ${cards.length} cards`)

  return cards
}
