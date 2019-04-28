import { cm2px, limit } from "@cardsgame/utils"
import { IEntity, IEntityOptions, EntityConstructor } from "./traits/entity"
import { Schema, type } from "@colyseus/schema"
import { IParent } from "./traits/parent"
import { EntityTransformData } from "../transform"
import { State } from "../state"
import { Children } from "../children"
import { Player } from "../player"
import {
  IFlexyContainer,
  FlexyContainerConstructor,
  IFlexyContainerOptions,
  flexyContainerRestyleChild
} from "./traits/flexyContainer"

export class Row extends Schema implements IEntity, IParent, IFlexyContainer {
  // IEntity
  _state: State
  id: EntityID
  parent: EntityID
  owner: Player

  @type("uint16")
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
  @type(Children)
  _children = new Children()

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
    EntityConstructor(this, options)
    FlexyContainerConstructor(this, options)
  }

  restyleChild = flexyContainerRestyleChild
}

interface IRowOptions extends IFlexyContainerOptions {}
