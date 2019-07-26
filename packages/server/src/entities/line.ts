import { Schema, type } from "@colyseus/schema"
import { IEntity } from "../traits/entity"
import { IParent } from "../traits/parent"
import { State } from "../state"
import { Player } from "../player"
import { EntityTransform } from "../transform"

/**
 * TODO: finish it for SUPERHOT, but only once I'm almost done with everything
 * Row or column of set number of cards.
 * It contains maximum number of spots for cards.
 * A spot can be empty.
 */
export class Line extends Schema implements IEntity, IParent {
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

  restyleChild(
    child: IEntity,
    idx: number,
    children: IEntity[]
  ): EntityTransform {
    let spaceOuter = 0
    let spaceBetween = 0
    // [ 0 0 0     ]
    // [ ]
    return new EntityTransform(idx, -idx, 0)
  }
}
