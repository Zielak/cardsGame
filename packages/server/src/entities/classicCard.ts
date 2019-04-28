import { Schema, type } from "@colyseus/schema"
import { logs } from "../logs"
import {
  IEntity,
  getOwner,
  getParentEntity,
  IEntityOptions,
  EntityConstructor
} from "./traits/entity"
import { State } from "../state"
import { Client } from "colyseus"
import { ITwoSided } from "./traits/twoSided"
import { def } from "@cardsgame/utils"
import { Player } from "../player"

interface IClassicCard extends IEntity, ITwoSided {}

export class ClassicCard extends Schema implements IClassicCard {
  // IEntity
  _state: State
  id: EntityID
  parent: EntityID
  owner: Player

  @type("uint16")
  idx: number

  @type("string")
  type = "classicCard"
  @type("string")
  name: string

  @type("number")
  x: number
  @type("number")
  y: number
  @type("number")
  angle: number

  @type("number")
  width: number
  @type("number")
  height: number

  // ITwoSided
  @type("boolean")
  faceUp: boolean

  // My own props
  @type("string")
  suit: string

  @type("string")
  rank: string

  constructor(options: IClassicCardOptions) {
    super()
    EntityConstructor(this, options)

    this.suit = options.suit
    this.rank = options.rank
    this.name = options.suit + options.rank

    this.faceUp = def(options.faceUp, false)
  }
}

export interface IClassicCardOptions extends IEntityOptions {
  suit: string
  rank: string
  faceUp: boolean
}

/**
 * Visibility filter
 * @param my
 * @param client
 */
export const faceDownOnlyOwner = (my: IClassicCard, client: any): boolean => {
  // 1. To everyone only if it's faceUp
  // 2. To owner, only if it's in his hands
  return (
    my.faceUp ||
    (getOwner(my).clientID === (client as Client).id &&
      getParentEntity(my).type === "hand")
  )
}

export const standardDeckFactory = (
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
