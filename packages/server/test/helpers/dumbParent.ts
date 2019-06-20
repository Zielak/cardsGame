import { Schema, type } from "@colyseus/schema"
import {
  IEntity,
  IParent,
  EntityConstructor,
  IEntityOptions,
  containsChildren,
  ParentConstructor,
  canBeChild
} from "../../src/entities"
import { State } from "../../src/state"
import { Player } from "../../src/player"

@canBeChild
@containsChildren
export class DumbParent extends Schema implements IParent {
  // IEntity
  _state: State
  id: EntityID
  parent: EntityID
  owner: Player
  isInOwnersView: boolean
  isParent(): this is IParent {
    return true
  }

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
@containsChildren
export class ConstructedParent extends Schema implements IParent {
  // IEntity
  _state: State
  id: EntityID
  parent: EntityID
  owner: Player
  isInOwnersView: boolean
  isParent(): this is IParent {
    return true
  }

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
