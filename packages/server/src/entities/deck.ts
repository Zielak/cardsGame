import { Schema, type } from "@colyseus/schema"
import { IEntity, EntityConstructor, IEntityOptions } from "../traits/entity"
import {
  IParent,
  containsChildren,
  ParentConstructor,
  canBeChild,
  IParentOptions,
  ChildAddedHandler,
  ChildRemovedHandler
} from "../traits/parent"
import { State } from "../state"
import { Player } from "../player"
import { def } from "@cardsgame/utils"

@canBeChild
@containsChildren(false)
export class Deck extends Schema implements IEntity, IParent {
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
  type = "deck"
  @type("string")
  name = "Deck"

  @type("number")
  x: number
  @type("number")
  y: number
  @type("number")
  angle: number

  // IParent
  _childrenPointers: string[]
  hijacksInteractionTarget = true

  onChildAdded: ChildAddedHandler
  onChildRemoved: ChildRemovedHandler

  // ================

  @type("uint16")
  childCount: number = 0

  onEmptied: () => void

  // TODO: deck may display its topmost card, if it's `faceUp`

  childAdded(child: IEntity) {
    this.childCount++
    if (this.onChildAdded) {
      this.onChildAdded(child)
    }
  }
  childRemoved(idx: number) {
    this.childCount--
    if (this.onChildAdded) {
      this.onChildRemoved(idx)
    }
    if (this.childCount === 0 && this.onEmptied) {
      this.onEmptied()
    }
  }

  constructor(options: IDeckOptions) {
    super()
    ParentConstructor(this, options)
    EntityConstructor(this, options)

    this.onEmptied = def(options.onEmptied, undefined)
  }
}

interface IDeckOptions extends IParentOptions, IEntityOptions {
  onEmptied?: () => void
}
