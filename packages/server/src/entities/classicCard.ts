import { IBaseCardOptions } from "./baseCard"
import { logs } from "../logs"
import { Entity, IEntityImplementation } from "./entity"

export const ClassicCard: IEntityImplementation = (
  entity: Entity,
  options: IClassicCardOptions
) => {
  entity.type = "classicCard"
  entity.data.suit = options.suit
  entity.data.rank = options.rank
  entity.name = options.suit + options.rank

  return {
    suit: {
      get: () => entity.data.suit
    },
    rank: {
      get: () => entity.data.rank
    }
  }
}

export interface IClassicCardOptions extends IBaseCardOptions {
  suit: string
  rank: string
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
