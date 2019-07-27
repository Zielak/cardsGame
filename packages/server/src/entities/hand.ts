import { Schema, type } from "@colyseus/schema"
import { def } from "@cardsgame/utils"
import { IEntityOptions, IEntity, EntityConstructor } from "../traits/entity"
import {
  IParent,
  containsChildren,
  ParentConstructor,
  canBeChild
} from "../traits/parent"
import { State } from "../state"
import { Player } from "../player"

@canBeChild
@containsChildren
export class Hand extends Schema implements IEntity, IParent {
  // IEntity
  _state: State
  id: EntityID
  parent: EntityID
  owner: Player
  isParent(): this is IParent {
    return true
  }

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

  /* Disable AutoSort for now
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
  */
}

export interface IHandOptions extends IEntityOptions {
  autoSort?: SortingFunction
}

type SortingFunction = (childA: IEntity, childB: IEntity) => number
