import { IEntity, IEntityOptions, EntityConstructor } from "../traits/entity"
import { Schema, type } from "@colyseus/schema"
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
export class Container extends Schema implements IEntity, IParent {
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
  type = "container"
  @type("string")
  name = "Container"

  @type("number")
  x: number
  @type("number")
  y: number
  @type("number")
  angle: number

  // IParent
  _childrenPointers: string[]
  hijacksInteractionTarget = false

  constructor(options: IEntityOptions) {
    super()
    ParentConstructor(this)
    EntityConstructor(this, options)
  }
}
