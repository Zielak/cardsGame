import { Schema, type } from "@colyseus/schema"
import { logs } from "@cardsgame/utils"
import {
  IEntity,
  getOwner,
  getParentEntity,
  IEntityOptions,
  EntityConstructor
} from "../traits/entity"
import { State } from "../state"
import { Client } from "colyseus"
import { ITwoSided } from "../traits/twoSided"
import { def } from "@cardsgame/utils"
import { Player } from "../player"
import { IParent, canBeChild } from "../traits/parent"
import { IBoxModel } from "../traits/boxModel"

interface IClassicCard extends IEntity, ITwoSided, IBoxModel {}

/**
 * Visibility filter
 * @param my
 * @param client
 */
export function faceDownOnlyOwner(
  this: Schema & IClassicCard,
  client: any,
  value: any
): boolean {
  logs.notice("faceDownOnlyOwner", this.name, ":", value)
  // 1. To everyone only if it's faceUp
  // 2. To owner, only if it's in his hands
  return (
    this.faceUp ||
    (getOwner(this).clientID === (client as Client).id &&
      getParentEntity(this).type === "hand")
  )
}

@canBeChild
export class ClassicCard extends Schema implements IClassicCard {
  // IEntity
  _state: State
  id: EntityID
  owner: Player
  parent: EntityID
  isParent(): this is IParent {
    return false
  }

  @type("string")
  ownerID: string

  @type("boolean")
  isInOwnersView: boolean

  @type("uint8")
  idx: number

  // @filter(faceDownOnlyOwner)
  @type("string")
  type = "classicCard"
  // @filter(faceDownOnlyOwner)
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
  // @filter(faceDownOnlyOwner)
  @type("string")
  suit: string

  // @filter(faceDownOnlyOwner)
  @type("string")
  rank: string

  constructor(options: IClassicCardOptions) {
    super()
    this.suit = options.suit
    this.rank = options.rank
    this.name = options.suit + options.rank

    this.faceUp = def(options.faceUp, false)

    EntityConstructor(this, options)
  }
}

export interface IClassicCardOptions extends IEntityOptions {
  suit: string
  rank: string
  faceUp?: boolean
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

  logs.notice(`created a deck of ${cards.length} cards`)

  return cards
}
