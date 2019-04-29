import { cm2px, limit } from "@cardsgame/utils"
import { IEntity, IEntityOptions, EntityConstructor } from "./traits/entity"
import { Schema, type } from "@colyseus/schema"
import { IParent, containsChildren, ParentConstructor } from "./traits/parent"
import { EntityTransformData } from "../transform"
import { State } from "../state"
import { Player } from "../player"

@containsChildren
export class Deck extends Schema implements IEntity, IParent {
  // IEntity
  _state: State
  id: EntityID
  parent: EntityID
  owner: Player
  isParent(): this is IParent {
    return true
  }

  @type("uint16")
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

  @type("number")
  width: number
  @type("number")
  height: number

  // IParent
  _childrenPointers: string[]
  hijacksInteractionTarget = true

  constructor(options: IEntityOptions) {
    super()
    EntityConstructor(this, options)
    ParentConstructor(this)
  }

  restyleChild(
    child: IEntity,
    idx: number,
    children: IEntity[]
  ): EntityTransformData {
    const MAX_HEIGHT = cm2px(2.5)
    const MIN_SPACE = cm2px(0.1)
    const SPACE = limit(MAX_HEIGHT / children.length, 0, MIN_SPACE)
    return {
      x: idx * SPACE,
      y: -idx * SPACE,
      angle: 0
    }
  }
}
