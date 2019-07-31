import { Schema, type } from "@colyseus/schema"
import {
  EntityConstructor,
  IEntityOptions,
  IEntity
} from "../../src/traits/entity"
import {
  IParent,
  containsChildren,
  ParentConstructor,
  canBeChild
} from "../../src/traits/parent"
import { State } from "../../src/state"
import { Player } from "../../src/player"

@canBeChild
@containsChildren()
export class DumbParent extends Schema implements IEntity, IParent {
  // IEntity
  _state: State
  id: EntityID
  owner: Player
  parent: EntityID
  isInOwnersView: boolean
  isParent(): this is IParent {
    return true
  }

  @type("string")
  ownerID: string

  @type("uint8")
  idx: number

  @type("string")
  type = "parent"
  @type("string")
  name = "Dumb"

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
}

@canBeChild
@containsChildren()
export class ConstructedParent extends Schema implements IEntity, IParent {
  // IEntity
  _state: State
  id: EntityID
  owner: Player
  parent: EntityID
  isInOwnersView: boolean
  isParent(): this is IParent {
    return true
  }

  @type("string")
  ownerID: string

  @type("uint8")
  idx: number

  @type("string")
  type = "parent"
  @type("string")
  name = "Constructed"

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

  constructor(options: IEntityOptions) {
    super()
    ParentConstructor(this)
    EntityConstructor(this, options)
  }
}
