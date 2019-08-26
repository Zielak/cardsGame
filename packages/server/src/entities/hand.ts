import { Schema, type } from "@colyseus/schema"
import { IEntity, EntityConstructor, IEntityOptions } from "../traits/entity"
import {
  IParent,
  containsChildren,
  ParentConstructor,
  canBeChild,
  countChildren,
  getChild,
  moveChildTo,
  IParentOptions
} from "../traits/parent"
import { State } from "../state"
import { Player } from "../player"

@canBeChild
@containsChildren()
export class Hand extends Schema implements IEntity, IParent {
  // IEntity
  _state: State
  id: EntityID
  owner: Player
  parent: EntityID
  isParent(): this is IParent {
    return true
  }

  @type("string")
  ownerID: string

  @type("boolean")
  isInOwnersView: boolean

  @type("uint8")
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

  // IParent
  _childrenPointers: string[]
  hijacksInteractionTarget = false

  onChildAdded: any
  onChildRemoved: any

  // Hand's own stuff
  autoSort: SortingFunction

  constructor(options: IHandOptions) {
    super()
    ParentConstructor(this, options)
    EntityConstructor(this, options)

    this.autoSort = options.autoSort
  }

  childAdded(child: IEntity) {
    if (!this.autoSort) return
    const count = countChildren(this)
    for (let idx = 0; idx < count; idx++) {
      if (this.autoSort(child, getChild(this, idx)) > 0) {
        continue
      }
      // I shall drop incomming child right here
      moveChildTo(this, child.idx, idx)
      break
    }
  }
}

export interface IHandOptions extends IParentOptions, IEntityOptions {
  autoSort?: SortingFunction
}

type SortingFunction = (childA: IEntity, childB: IEntity) => number
