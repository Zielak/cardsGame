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

export function isChild(entity: any): entity is ChildTrait {
  return (
    typeof (entity as ChildTrait).idx !== "undefined" &&
    typeof (entity as ChildTrait).parent !== "undefined"
  )
}

export class ChildTrait {
  id: EntityID

  idx: number

  parent: ParentTrait

  constructor(state: State, options: Partial<ChildTrait> = {}) {
    // Parent
    setParent(state, this, def(options.parent, state))

    if (typeof options.idx === "number") {
      moveChildTo(this.parent, this.idx, options.idx)
    }
  }
}

;(ChildTrait as any).typeDef = { idx: "number" }

export function setParent(
  state: State,
  entity: ChildTrait,
  newParent: ParentTrait
) {
  if (entity.parent !== undefined && entity.parent !== state) {
    removeChildAt(getParentEntity(state, entity), entity.idx)
  }

  const con = getKnownConstructor(entity)
  const targetArray = newParent["children" + con.name] as ArraySchema<
    ChildTrait
  >
  targetArray.push(entity)

  entity.idx = countChildren(newParent)
  entity.parent = newParent
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
  if (isParent(entity.parent)) {
    return entity.parent
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
