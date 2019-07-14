import {
  IEntityOptions,
  IEntity,
  ITwoSided,
  State,
  Player,
  IParent,
  EntityConstructor,
  canBeChild,
  type,
  Schema
} from "@cardsgame/server"
import { def } from "@cardsgame/utils"

interface ICard extends IEntity, ITwoSided {}

@canBeChild
export class Card extends Schema implements ICard {
  // IEntity
  _state: State
  id: EntityID
  parent: EntityID
  owner: Player
  isInOwnersView: boolean
  isParent(): this is IParent {
    return false
  }

  @type("uint8")
  idx: number

  // @filter(faceDownOnlyOwner)
  @type("string")
  type = "splendorCard"
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

  // @filter(faceDownOnlyOwner)
  @type("uint8")
  level: number

  // @filter(faceDownOnlyOwner)
  @type("uint8")
  costD: number // White

  // @filter(faceDownOnlyOwner)
  @type("uint8")
  costS: number // Blue

  // @filter(faceDownOnlyOwner)
  @type("uint8")
  costE: number // Green

  // @filter(faceDownOnlyOwner)
  @type("uint8")
  costR: number // Red

  // @filter(faceDownOnlyOwner)
  @type("uint8")
  costO: number // Black

  // @filter(faceDownOnlyOwner)
  @type("uint8")
  gem: Gems

  // @filter(faceDownOnlyOwner)
  @type("uint8")
  vp: number

  constructor(options: ICardOptions) {
    super()
    this.level = options.level
    this.gem = options.gem

    this.costD = def(options.costD, 0)
    this.costS = def(options.costS, 0)
    this.costE = def(options.costE, 0)
    this.costR = def(options.costR, 0)
    this.costO = def(options.costO, 0)
    this.vp = def(options.vp, 0)

    this.name =
      "splendor" +
      [
        this.level,
        this.gem,
        this.costD,
        this.costS,
        this.costE,
        this.costR,
        this.costO,
        this.vp
      ].join("")

    this.faceUp = def(options.faceUp, false)

    EntityConstructor(this, options)
  }
}

interface ICardOptions extends IEntityOptions {
  level: number
  gem: Gems
  costD?: number
  costS?: number
  costE?: number
  costR?: number
  costO?: number
  vp?: number
  faceUp?: boolean
}

export enum Gems {
  Diamond,
  Sapphire,
  Emerald,
  Ruby,
  Onyx,
  Gold
}

export const cardsDataLevel1 = [
  [0, 3, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 2, 1, 0, 1, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0],
  [0, 2, 0, 0, 2, 0, 1, 0, 0, 0, 0],
  [0, 0, 4, 0, 0, 1, 1, 0, 0, 0, 0],
  [0, 1, 2, 1, 1, 0, 1, 0, 0, 0, 0],
  [0, 2, 2, 0, 1, 0, 1, 0, 0, 0, 0],
  [3, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0],
  [1, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 3, 0, 0, 1, 0, 0, 0],
  [1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0],
  [0, 0, 2, 0, 2, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 4, 0, 1, 0, 1, 0, 0, 0],
  [1, 0, 1, 2, 1, 0, 0, 1, 0, 0, 0],
  [1, 0, 2, 2, 0, 0, 0, 1, 0, 0, 0],
  [0, 1, 3, 1, 0, 0, 0, 1, 0, 0, 0],
  [2, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 3, 0, 0, 0, 0, 1, 0, 0],
  [1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0],
  [0, 2, 0, 2, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 4, 1, 0, 0, 1, 0, 0],
  [1, 1, 0, 1, 2, 0, 0, 0, 1, 0, 0],
  [0, 1, 0, 2, 2, 0, 0, 0, 1, 0, 0],
  [1, 3, 1, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 2, 1, 0, 0, 0, 0, 0, 0, 1, 0],
  [3, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0],
  [2, 0, 0, 2, 0, 0, 0, 0, 0, 1, 0],
  [4, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
  [2, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0],
  [2, 0, 1, 0, 2, 0, 0, 0, 0, 1, 0],
  [1, 0, 0, 1, 3, 0, 0, 0, 0, 1, 0],
  [0, 0, 2, 1, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1],
  [0, 4, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 2, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [2, 2, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 1, 3, 1, 0, 0, 0, 0, 0, 1]
]

export const cardsDataLevel2 = [
  [0, 0, 0, 5, 0, 2, 1, 0, 0, 0, 0],
  [6, 0, 0, 0, 0, 3, 1, 0, 0, 0, 0],
  [0, 0, 3, 2, 2, 1, 1, 0, 0, 0, 0],
  [0, 0, 1, 4, 2, 2, 1, 0, 0, 0, 0],
  [2, 3, 0, 3, 0, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 5, 3, 2, 1, 0, 0, 0, 0],
  [0, 5, 0, 0, 0, 2, 0, 1, 0, 0, 0],
  [0, 6, 0, 0, 0, 3, 0, 1, 0, 0, 0],
  [0, 2, 2, 3, 0, 1, 0, 1, 0, 0, 0],
  [2, 0, 0, 1, 4, 2, 0, 1, 0, 0, 0],
  [0, 2, 3, 0, 3, 1, 0, 1, 0, 0, 0],
  [5, 3, 0, 0, 0, 2, 0, 1, 0, 0, 0],
  [0, 0, 5, 0, 0, 2, 0, 0, 1, 0, 0],
  [0, 0, 6, 0, 0, 3, 0, 0, 1, 0, 0],
  [2, 3, 0, 0, 2, 1, 0, 0, 1, 0, 0],
  [3, 0, 2, 3, 0, 1, 0, 0, 1, 0, 0],
  [4, 2, 0, 0, 1, 2, 0, 0, 1, 0, 0],
  [0, 5, 3, 0, 0, 2, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 5, 2, 0, 0, 0, 1, 0],
  [0, 0, 0, 6, 0, 3, 0, 0, 0, 1, 0],
  [2, 0, 0, 2, 3, 1, 0, 0, 0, 1, 0],
  [1, 4, 2, 0, 0, 2, 0, 0, 0, 1, 0],
  [0, 3, 0, 2, 3, 1, 0, 0, 0, 1, 0],
  [3, 0, 0, 0, 5, 2, 0, 0, 0, 1, 0],
  [5, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1],
  [0, 0, 0, 0, 6, 3, 0, 0, 0, 0, 1],
  [3, 2, 2, 0, 0, 1, 0, 0, 0, 0, 1],
  [0, 1, 4, 2, 0, 2, 0, 0, 0, 0, 1],
  [3, 0, 3, 0, 2, 1, 0, 0, 0, 0, 1],
  [0, 0, 5, 3, 0, 2, 0, 0, 0, 0, 1]
]

export const cardsDataLevel3 = [
  [0, 0, 0, 0, 7, 4, 1, 0, 0, 0, 0],
  [3, 0, 0, 0, 7, 5, 1, 0, 0, 0, 0],
  [3, 0, 0, 3, 6, 4, 1, 0, 0, 0, 0],
  [0, 3, 3, 5, 3, 3, 1, 0, 0, 0, 0],
  [7, 0, 0, 0, 0, 4, 0, 1, 0, 0, 0],
  [7, 3, 0, 0, 0, 5, 0, 1, 0, 0, 0],
  [6, 3, 0, 0, 3, 4, 0, 1, 0, 0, 0],
  [3, 0, 3, 3, 5, 3, 0, 1, 0, 0, 0],
  [0, 7, 0, 0, 0, 4, 0, 0, 1, 0, 0],
  [0, 7, 3, 0, 0, 5, 0, 0, 1, 0, 0],
  [3, 6, 3, 0, 0, 4, 0, 0, 1, 0, 0],
  [5, 3, 0, 3, 3, 3, 0, 0, 1, 0, 0],
  [0, 0, 7, 0, 0, 4, 0, 0, 0, 1, 0],
  [0, 0, 7, 3, 0, 5, 0, 0, 0, 1, 0],
  [0, 3, 6, 3, 0, 4, 0, 0, 0, 1, 0],
  [3, 5, 3, 0, 3, 3, 0, 0, 0, 1, 0],
  [0, 0, 0, 7, 0, 4, 0, 0, 0, 0, 1],
  [0, 0, 0, 7, 3, 5, 0, 0, 0, 0, 1],
  [0, 0, 3, 6, 3, 4, 0, 0, 0, 0, 1],
  [3, 3, 5, 3, 0, 3, 0, 0, 0, 0, 1]
]
