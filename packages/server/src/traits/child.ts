import { type, ArraySchema } from "@colyseus/schema"
import { def } from "@cardsgame/utils"
import { State } from "../state"
import {
  moveChildTo,
  ParentTrait,
  removeChildAt,
  countChildren,
  getKnownConstructor,
  isParent
} from "./parent"
import { IdentityTrait } from "./identity"
import { Entity } from "./entity"

export function isChild(entity: any): entity is ChildTrait {
  return (
    typeof (entity as ChildTrait).idx !== "undefined" &&
    typeof (entity as ChildTrait).parent !== "undefined"
  )
}

export class ChildTrait extends Entity {
  @type("number")
  idx: number

  parent: EntityID
}

ChildTrait.prototype.constructor = function(
  this: ChildTrait,
  state: State,
  options: Partial<ChildTrait> = {}
) {
  // Parent
  this.parent = def(options.parent, -1)

  const newParent: ParentTrait & IdentityTrait =
    this.parent >= 0 ? state.getEntity(this.parent) : state

  setParent(this, newParent, state)

  if (typeof options.idx === "number") {
    moveChildTo(newParent, this.idx, options.idx)
  }
}

export function setParent(
  entity: ChildTrait,
  newParent: ParentTrait,
  state: State
) {
  if (entity.parent !== undefined && entity.parent !== -1) {
    removeChildAt(getParentEntity(state, entity), entity.idx)
  }

  const con = getKnownConstructor(entity)
  const targetArray = newParent["children" + con.name] as ArraySchema<
    ChildTrait
  >
  targetArray.push(entity)

  entity.idx = countChildren(newParent)
  entity.parent = newParent.id
  newParent.childrenPointers.push(con.name)

  if (newParent.childAdded) {
    newParent.childAdded(entity)
  }
}

/**
 * Gets a reference to this entity's parent.
 * Root elements won't return state, but `undefined` instead.
 */
export function getParentEntity(state: State, entity: ChildTrait): ParentTrait {
  const parent = state.getEntity(entity.parent)
  if (isParent(parent)) {
    return parent
  }
}

/**
 * @returns array of indexes for this entity access
 */
export function getIdxPath(state: State, entity: ChildTrait): number[] {
  const path: number[] = [entity.idx]

  const next = (entity: ChildTrait) => {
    const parent = getParentEntity(state, entity)
    if (!parent) {
      return
    }
    if (isChild(parent)) {
      const parentsIdx = parent.idx

      path.unshift(parentsIdx)
      next(parent)
    }
  }
  next(entity)

  return path
}
