import { randomFloat } from "@cardsgame/utils"
import { Schema, type } from "@colyseus/schema"
import { IEntityOptions, IEntity, EntityConstructor } from "./traits/entity"
import {
  IParent,
  containsChildren,
  ParentConstructor,
  canBeChild
} from "./traits/parent"
import { State } from "../state"
import { EntityTransform } from "../transform"
import { Player } from "../player"

@canBeChild
@containsChildren
export class Pile extends Schema implements IEntity, IParent {
  // IEntity
  _state: State
  id: EntityID
  parent: EntityID
  owner: Player
  isInOwnersView: boolean
  isParent(): this is IParent {
    return true
  }

  @type("uint16")
  idx: number

  @type("string")
  type = "pile"
  @type("string")
  name = "Pile"

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

  // IParent
  _childrenPointers: string[]
  hijacksInteractionTarget = true

  // Pile's own props
  cardsData = new Array<EntityTransform>()
  limits: PileVisualLimits

  constructor(options: IPileOptions) {
    super()
    EntityConstructor(this, options)
    ParentConstructor(this)

    this.limits = Object.assign(
      {},
      {
        minAngle: -45,
        maxAngle: 45,
        minX: -10,
        minY: -10,
        maxX: 10,
        maxY: 10
      },
      options.limits
    )
  }

  restyleChild(child: IEntity) {
    return this.cardsData[child.idx] || new EntityTransform()
  }

  onChildAdded() {
    this.cardsData.push(cardsDataFactory(this.limits))
  }
  onChildRemoved(idx: number) {
    this.cardsData = this.cardsData.filter((_, i) => i !== idx)
  }

  clone() {
    const clone = new Pile({
      state: this._state,
      type: this.type,
      name: this.name,
      width: this.width,
      height: this.height,
      x: this.x,
      y: this.y,
      angle: this.angle,
      parent: this.parent,
      idx: this.idx,
      owner: this.owner,
      isInOwnersView: this.isInOwnersView
    })

    clone.cardsData = [...this.cardsData.map(e => e.clone())]

    return clone
  }
}

export interface IPileOptions extends IEntityOptions {
  limits?: PileVisualLimits
}

const cardsDataFactory = (limits): EntityTransform =>
  new EntityTransform(
    randomFloat(limits.minX, limits.maxX),
    randomFloat(limits.minY, limits.maxY),
    randomFloat(limits.minAngle, limits.maxAngle)
  )

// const DEFAULT_CARDS_DATA = Object.freeze(new EntityTransform())

interface PileVisualLimits {
  minAngle: number
  maxAngle: number
  minX: number
  minY: number
  maxX: number
  maxY: number
}
