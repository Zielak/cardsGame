import { float } from "@cardsgame/utils"
import { IEntityOptions, IEntity, EntityConstructor } from "./traits/entity"
import { Schema, type } from "@colyseus/schema"
import { IParent } from "./traits/parent"
import { Children } from "../children"
import { State } from "../state"
import { EntityTransformData } from "../transform"
import { Player } from "../player"

export class Pile extends Schema implements IParent {
  // IEntity
  _state: State
  id: EntityID
  parent: EntityID
  owner: Player

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

  hijacksInteractionTarget = true

  // IChildrenHolder
  @type(Children)
  _children = new Children()

  // Pile's own props
  cardsData = new Array<EntityTransformData>()
  limits: PileVisualLimits

  constructor(options: IPileOptions) {
    super()
    EntityConstructor(this, options)

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
    const { x, y, angle } = this.cardsData[child.idx] || DEFAULT_CARDS_DATA
    return { x, y, angle, test: "a" }
  }

  onChildAdded() {
    this.cardsData.push(cardsDataFactory(this.limits))
  }
  onChildRemoved(idx: number) {
    this.cardsData = this.cardsData.filter((_, i) => i !== idx)
  }
}

export interface IPileOptions extends IEntityOptions {
  limits?: PileVisualLimits
}

const cardsDataFactory = (limits): EntityTransformData => {
  return {
    x: float(limits.minX, limits.maxX),
    y: float(limits.minY, limits.maxY),
    angle: float(limits.minAngle, limits.maxAngle)
  }
}

const DEFAULT_CARDS_DATA: EntityTransformData = {
  x: 0,
  y: 0,
  angle: 0
}

interface PileVisualLimits {
  minAngle: number
  maxAngle: number
  minX: number
  minY: number
  maxX: number
  maxY: number
}
