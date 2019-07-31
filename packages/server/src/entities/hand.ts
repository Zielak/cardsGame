import { Schema, type } from "@colyseus/schema"
import { def } from "@cardsgame/utils"
import { IEntityOptions, IEntity, EntityConstructor } from "../traits/entity"
import {
  IParent,
  containsChildren,
  ParentConstructor,
  canBeChild,
  countChildren,
  getChild,
  moveChildTo
} from "../traits/parent"
import { State } from "../state"
import { Player } from "../player"

@canBeChild
@containsChildren
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

  // Hand's own stuff
  autoSort: SortingFunction

  constructor(options: IHandOptions) {
    super()
    ParentConstructor(this)
    EntityConstructor(this, options)

    this.autoSort = def(options.autoSort, () => -1)
  }

  onChildAdded(child: IEntity) {
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

export interface IHandOptions extends IEntityOptions {
  autoSort?: SortingFunction
}

type SortingFunction = (childA: IEntity, childB: IEntity) => number
