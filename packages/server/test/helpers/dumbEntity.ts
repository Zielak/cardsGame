import { Schema, type } from "@colyseus/schema"
import {
  IEntity,
  EntityConstructor,
  IEntityOptions
} from "../../src/traits/entity"
import { IParent, canBeChild } from "../../src/traits/parent"
import { State } from "../../src/state"
import { Player } from "../../src/player"

@canBeChild
export class DumbEntity extends Schema implements IEntity {
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
  type = "dumb"
  @type("string")
  name = "Dummie"

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
}

@canBeChild
export class ConstructedEntity extends Schema implements IEntity {
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
  type = "dumb"
  @type("string")
  name = "Dummie"

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

  constructor(options: IEntityOptions) {
    super()
    EntityConstructor(this, options)
  }
}
