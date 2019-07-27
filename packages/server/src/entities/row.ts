import { EntityConstructor, IEntity } from "../traits/entity"
import { Schema, type } from "@colyseus/schema"
import { IParent, ParentConstructor } from "../traits/parent"
import { State } from "../state"
import { Player } from "../player"
import {
  IFlexyContainer,
  FlexyContainerConstructor,
  IFlexyContainerOptions
} from "../traits/flexyContainer"

export class Row extends Schema implements IEntity, IParent, IFlexyContainer {
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
  type = "row"
  @type("string")
  name = "Row"

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

  // IFlexyContainer
  alignItems: "start" | "end" | "center"
  directionReverse: boolean
  justifyContent:
    | "start"
    | "end"
    | "center"
    | "spaceBetween"
    | "spaceAround"
    | "spaceEvenly"

  constructor(options: IRowOptions) {
    super()
    ParentConstructor(this)
    EntityConstructor(this, options)
    FlexyContainerConstructor(this, options)
  }
}

interface IRowOptions extends IFlexyContainerOptions {}
