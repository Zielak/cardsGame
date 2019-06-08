import Bezier from "bezier-js"
import { Schema, type } from "@colyseus/schema"
import { def } from "@cardsgame/utils"
import { logs } from "../logs"
import { IEntityOptions, IEntity, EntityConstructor } from "./traits/entity"
import {
  IParent,
  containsChildren,
  ParentConstructor,
  countChildren,
  getChild,
  moveChildTo,
  canBeChild
} from "./traits/parent"
import { State } from "../state"
import { EntityTransform } from "../transform"
import { Player } from "../player"

@canBeChild
@containsChildren
export class Hand extends Schema implements IEntity, IParent {
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
  type = "hand"
  @type("string")
  name = "Hand"

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
  hijacksInteractionTarget = false

  // Hand's own stuff
  autoSort: SortingFunction

  constructor(options: IHandOptions) {
    super()
    EntityConstructor(this, options)
    ParentConstructor(this)

    this.autoSort = def(options.autoSort, () => -1)
  }

  clone() {
    return new Hand({
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
      isInOwnersView: this.isInOwnersView,

      autoSort: this.autoSort
    })
  }

  onChildAdded(child: IEntity) {
    const count = countChildren(this)
    logs.info(`Hand.autoSort`, `0..${count}`)
    for (let idx = 0; idx < count; idx++) {
      if (this.autoSort(child, getChild(this, idx)) > 0) {
        continue
      }
      // I shall drop incomming child right here
      logs.info(`Hand.autoSort`, `children.moveChildTo(${child.idx}, ${idx})`)
      moveChildTo(this, child.idx, idx)

      logs.info(`Hand.autoSort`, `AFTER:`)
      this._state.logTreeState(this)
      break
    }
  }

  restyleChild(
    child: IEntity,
    idx: number,
    children: IEntity[]
  ): EntityTransform {
    const max = children.length
    const maxSpread = 8

    const outerX = maxSpread + max / 3
    const addY = max > maxSpread ? -(maxSpread - max) / 5 : 0

    //    [1]----[2]
    //    /       \
    //   /         \
    // [0]        [3]
    const b = new Bezier([
      { x: -outerX, y: 4 + addY },
      { x: -outerX + outerX / 2.5, y: -2 - addY },
      { x: outerX - outerX / 2.5, y: -2 - addY },
      { x: outerX, y: 4 + addY }
    ])

    const space = 1 / maxSpread
    let perc = idx / (max - 1)

    // Outer padding, from edge to the card
    const P = () => {
      // max
      //  1 -> 0
      var m = Math.abs(Math.min(0, max - maxSpread))
      var P = m / (maxSpread - 1) / 2
      return P
    }

    perc = max <= maxSpread ? P() + space * idx + space / 2 : perc

    const point = b.get(perc)
    const n = b.normal(perc)

    return new EntityTransform(
      point.x * 10,
      point.y * 10,
      (Math.atan2(n.y, n.x) * 180) / Math.PI + 270
    )
  }
}

export interface IHandOptions extends IEntityOptions {
  autoSort?: SortingFunction
}

type SortingFunction = (childA: IEntity, childB: IEntity) => number
