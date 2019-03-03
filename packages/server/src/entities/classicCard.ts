import { Card, ICardOptions } from "./card"
import { logs } from "../logs"
import { condvis } from "../decorators"

export interface IClassicCardOptions extends ICardOptions {
  suit: string
  rank: string
}

export class ClassicCard extends Card {
  type = "classicCard"

  @condvis
  name: string
  @condvis
  suit: string
  @condvis
  rank: string

  constructor(options: IClassicCardOptions) {
    super(options)

    this._visibilityData.add(
      ["name", "suit", "rank"],
      /* toEveryone */ () => this.faceUp,
      /* toOwner */ () => {
        // Only if it's in his hand
        const parentContainer = (this as ClassicCard).parentEntity
        return parentContainer.type === "hand"
      }
    )

    this.suit = options.suit
    this.rank = options.rank
    this.name = this.rank + this.suit
  }
}

export const standardDeck = (
  ranks: string[] = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A"
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
