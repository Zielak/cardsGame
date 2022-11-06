import { arrayWith, def, limit, logs, sortByIdx } from "@cardsgame/utils"
import { ArraySchema } from "@colyseus/schema"

import { globalEntitiesContext } from "../annotations/entitiesContext.js"
import { queryRunner } from "../queries/runner.js"
import type { QuerableProps } from "../queries/types.js"
import type { State } from "../state/state.js"

import type { ChildTrait } from "./child.js"
import { executeHook } from "./entity.js"
import { errors } from "./parent/errors.js"

/**
 * @category Parent
 */
export function isParent(entity: unknown): entity is ParentTrait {
  return (
    typeof entity == "object" &&
    typeof (entity as ParentTrait).query !== "undefined" &&
    typeof (entity as ParentTrait).getChildren !== "undefined"
  )
}

export type ChildAddedHandler = (child: ChildTrait) => void
export type ChildRemovedHandler = (idx: number) => void

/**
 * @category Parent
 */
export const hasChildren = (entity: unknown): boolean =>
  isParent(entity) ? entity.countChildren() > 0 : false

/**
 * @ignore
 */
export const getKnownConstructor = (entity: ChildTrait): AnyClass =>
  globalEntitiesContext.registeredChildren.find((con) => entity instanceof con)

/**
 * **Important trait**
 *
 * Entity will behave as container to hold all other entities with `ChildTrait`.
 *
 * Has many methods for adding, fetching, removing and manipulating order of children.
 *
 * Can behave as:
 *
 * - an array - all children are indexed next to each other
 * - a map - there can be empty spaces between children
 *
 * @category Trait
 */
export class ParentTrait {
  /**
   * ChildTrait object -> its constructor's name
   * Also good spot to count all children
   * @category ParentTrait
   */
  childrenPointers: Map<ChildTrait, string>

  /**
   * Used by [ChildTrait.`isInteractive`](/api/server/classes/ChildTrait#isInteractive).
   *
   * If set to true, will prevent its direct children from getting interaction events.
   *
   * @category ParentTrait
   */
  hijacksInteractionTarget: boolean
  /**
   * @default Infinity
   * @category ParentTrait
   */
  maxChildren: number
  /**
   * How children and their indexes behave when added into or removed from this parent.
   * - array: there can be no empty spots, children will always move to fill in the gaps
   * - map: no automatic movement is performed, adding to first empty spot,
   *   otherwise you need to ensure given spot isn't occupied
   * @default "array"
   * @category ParentTrait
   */
  collectionBehaviour: "array" | "map"

  childAdded: ChildAddedHandler
  childRemoved: ChildRemovedHandler

  removeChild(child: ChildTrait): boolean {
    if (child.parent === this) {
      return this.removeChildAt(child.idx)
    } else {
      return false
    }
  }

  removeChildAt(idx: number): boolean {
    // ------ check

    const child: ChildTrait = this.getChild(idx)
    if (!child) {
      logs.error("removeChildAt", `getChild - I don't have ${idx} child?`)
      return false
    }

    // ------ remove

    const targetInternalArrayName = `children${this.childrenPointers.get(
      child
    )}`
    const targetInternalArray: ArraySchema = this[targetInternalArrayName]
    const childIdx = targetInternalArray.findIndex((el) => el.idx === idx)
    this.childrenPointers.delete(child)

    const removedChild = this[targetInternalArrayName].splice(
      childIdx,
      1
    )[0] as ChildTrait

    if (removedChild !== child) {
      logs.error("child:", child.idx, child["name"])
      logs.error("removedChild:", removedChild.idx, removedChild["name"])
      throw new Error(errors.VERY_UNEXPECTED_ERROR(child, removedChild))
    }

    const updatesLog: IndexUpdate[] = []
    if (this.collectionBehaviour === "array") {
      updatesLog.push(...this.move(-1, idx + 1, this.getTop()?.idx))
    }

    // ------ notify
    executeHook.call(this, "childRemoved", idx)
    updatesLog.forEach((entry) => {
      executeHook.call(this, "childIndexUpdated", entry.from, entry.to)
    })

    removedChild.parent = undefined

    return true
  }

  /**
   * Adds new item.
   * @param entity
   */
  addChild(entity: ChildTrait): void
  /**
   * Adds new item.
   * @param entity
   * @param prepen squeeze into the first place, moving other children away.
   */
  addChild(entity: ChildTrait, prepend: boolean): void
  /**
   * Adds new item.
   * @param entity
   * @param atIndex squeeze into desired spot, moving other children away.
   */
  addChild(entity: ChildTrait, atIndex: number): void
  /**
   * Adds new item.
   */
  addChild(entity: ChildTrait, arg1: boolean | number): void
  addChild(entity: ChildTrait, arg1?: boolean | number): void {
    if (!entity) {
      throw new Error(errors.ADDCHILD_MISSING_ARG0())
    }

    const prepend = typeof arg1 === "boolean" ? arg1 : undefined
    const atIndex = typeof arg1 === "number" ? arg1 : undefined

    // Ensure this parent still has space
    if (typeof atIndex === "number" && !this.indexFits(atIndex)) {
      throw new Error(errors.INDEX_DOESNT_FIT_RANGE(atIndex, this.maxChildren))
    }
    if (
      this.collectionBehaviour === "map" &&
      this.maxChildren !== Infinity &&
      this.countChildren() >= this.maxChildren
    ) {
      throw new Error(errors.ADDCHILD_NO_EMPTY_SPOTS())
    }

    if (entity.parent !== undefined) {
      entity.parent.removeChildAt(entity.idx)
    }

    const con = getKnownConstructor(entity)
    const targetInternalArray = this[
      `children${con.name}`
    ] as ArraySchema<ChildTrait>
    const updatesLog: IndexUpdate[] = []

    if (prepend) {
      if (this.collectionBehaviour === "array") {
        updatesLog.push(...this.move(1, 0, Infinity))
      } else {
        const targetIdx = this.getFirstEmptySpot()
        if (targetIdx === -1) {
          logs.error("addChild", `desired:${atIndex}`)
          throw new Error(errors.ADDCHILD_INDEX_OCCUPIED())
        }
        updatesLog.push(...this.move(1, 0, targetIdx - 1))
      }
      entity.idx = 0
    } else if (typeof atIndex === "number") {
      if (this.collectionBehaviour === "array") {
        updatesLog.push(...this.move(1, atIndex, Infinity))
        entity.idx = atIndex
      } else {
        if (!this.getChild(atIndex)) {
          entity.idx = atIndex
        } else {
          logs.error("addChild", `desired:${atIndex}`)
          throw new Error(errors.ADDCHILD_INDEX_OCCUPIED())
        }
      }
    } else {
      // squeeze it in the first available spot
      const newIndex = this.getFirstEmptySpot()
      if (newIndex < 0) {
        throw new Error(errors.ADDCHILD_UNEXPECTED_NO_SPOT())
      }

      entity.idx = newIndex
    }

    entity.parent = this

    targetInternalArray.push(entity)
    this.childrenPointers.set(entity, con.name)

    updatesLog.forEach(({ from, to }) =>
      executeHook.call(this, "childIndexUpdated", from, to)
    )
    executeHook.call(this, "childAdded", entity)
  }

  addChildren(entities: ChildTrait[]): void {
    entities.forEach((entity) => this.addChild(entity))
  }

  /**
   * In array, moves child to target idx, rearranging everything between `from` and `to`.
   * In map, swaps children at `from` and `to` (for now...)
   * @param from index of child to move
   * @param to desired target position
   */
  moveChildTo(from: number, to: number): void {
    // ----- check
    if (from === to) {
      logs.info("moveChildTo | moving to the same spot...")
      return
    }
    if (!this.indexFits(from)) {
      throw new Error(errors.INDEX_DOESNT_FIT_RANGE(from, this.maxChildren))
    }
    if (!this.indexFits(to)) {
      throw new Error(errors.INDEX_DOESNT_FIT_RANGE(to, this.maxChildren))
    }

    if (!this.getChild(from)) {
      throw new Error(errors.MOVECHILDTO_NOTHING_TO_MOVE(from))
    }

    const updatesLog: IndexUpdate[] = []
    const direction = from < to ? 1 : -1

    if (this.collectionBehaviour === "array") {
      // 1. pluck out the FROM
      const child = this.getChild(from)
      child.idx = undefined

      try {
        if (direction === 1) {
          updatesLog.push(...this.move(-direction, from + 1, to))
        } else {
          updatesLog.push(...this.move(-direction, to, from - 1))
        }
      } catch (e) {
        // Restore child's index
        child.idx = from
        throw new Error(errors.MOVECHILDTO_MOVE_FAILED(from, to, e.message))
      }

      child.idx = to
    } else {
      const childA = this.getChild(from)
      const childB = this.getChild(to)

      if (childA) {
        childA.idx = to
        updatesLog.push({ from, to })
      }

      if (childB) {
        childB.idx = from
        updatesLog.push({ from: to, to: from })
      }
    }

    updatesLog.forEach(({ from, to }) =>
      executeHook.call(this, "childIndexUpdated", from, to)
    )
  }

  /**
   * Number of child elements
   */
  countChildren(): number {
    return this.childrenPointers.size
  }

  /**
   * Gets all direct children in array form, "sorted" by idx
   */
  getChildren<T extends ChildTrait>(): T[] {
    if (!isParent(this)) {
      return []
    }

    return [...(this.childrenPointers as Map<T, string>).keys()].sort(sortByIdx)
  }

  /**
   * Get one direct child of `parent` by its `idx`
   */
  getChild<T extends ChildTrait>(idx: number): T {
    return this.getChildren<T>().find((child) => child.idx === idx)
  }

  /**
   * Get the element with highest 'idx' value
   */
  getTop<T extends ChildTrait>(): T {
    return this.getChildren<T>()[this.countChildren() - 1]
    // return this.getChildren<T>()[Math.max(0, this.childrenPointers.size - 1)]
  }

  /**
   * Get the element with the lowest 'idx' value
   */
  getBottom<T extends ChildTrait>(): T {
    return this.getChildren<T>()[0]
  }

  /**
   * For map behaviour, seeks out first available spot, starting from index 0.
   * Arrays don't have gaps, so first "available" spot is always after last child.
   * @returns index of first vacant spot, or -1 if no spot is available
   */
  getFirstEmptySpot(): number {
    if (this.countChildren() === 0) {
      // No children here yet
      return 0
    }
    if (this.collectionBehaviour === "array") {
      return this.countChildren()
    }

    const bottom = this.getBottom()
    let idx = 0

    if (bottom && bottom.idx !== 0) {
      return 0
    }

    if (this.maxChildren !== Infinity) {
      for (let i = 0; i < this.maxChildren; i++) {
        if (!this.getChild(i)) {
          return i
        }
      }
      return -1
    }

    while (this.getChild(idx)) {
      idx++
    }
    return idx
  }

  /**
   * unused?
   */
  getLastEmptySpot(): number {
    const top = this.getTop()
    if (top && top.idx !== this.maxChildren - 1) {
      return this.maxChildren - 1
    }

    const max =
      this.maxChildren !== Infinity ? this.maxChildren : this.countChildren()

    for (let i = max - 1; i > 0; i--) {
      if (!this.getChild(i)) {
        return i
      }
    }
    return -1
  }

  /**
   * unused?
   */
  getClosestEmptySpot(index: number): number {
    if (typeof index !== "number") {
      throw new Error("getClosestEmptySpot(), give me a number")
    }

    const childrenCount = this.countChildren()
    const allSpots = arrayWith(
      this.maxChildren !== Infinity ? this.maxChildren : childrenCount
    ).map((idx) => this.getChild(idx))

    for (let i = 1; i < childrenCount / 2; i++) {
      const left = index - i
      const right = index + i
      if (this.indexFits(left) && !allSpots[left]) {
        return left
      } else if (this.indexFits(right) && !allSpots[right]) {
        return right
      }
    }
    // I don't know
    return -1
  }

  /**
   * Does index fit in range of this container.
   * Doesn't check if index is occupied.
   * Considering `maxChildren` and if index is negative or otherwise invalid.
   * @param index
   */
  indexFits(index: number): boolean {
    if (index < 0) {
      return false
    }

    if (this.maxChildren !== Infinity) {
      return index < this.maxChildren
    }
    return true
  }

  /**
   * Find one item matching props.
   * @param props
   */
  query<T extends ChildTrait>(props: QuerableProps): T | undefined {
    // Grab all current children
    const children = this.getChildren<T>()

    // Check if maybe some of them match the query
    const firstLevel = children.find(queryRunner<T>(props))

    if (firstLevel) {
      return firstLevel
    }

    // Keep querying for the same props in children if they're also parents

    for (const entity of children) {
      if (!isParent(entity)) {
        continue
      }

      const result = entity.query<T>(props)
      if (result) {
        return result
      }
    }
  }

  /**
   * Looks for every matching entity here and deeper
   */
  queryAll<T extends ChildTrait>(props: QuerableProps): T[] {
    const result: (ChildTrait & T)[] = []

    // Grab all current children
    const children = this.getChildren<T>()

    // Check if maybe some of them match the query
    result.push(...children.filter(queryRunner<T>(props)))

    // Keep querying for the same props in children if they're also parents
    for (const entity of children) {
      if (!isParent(entity)) {
        continue
      }

      result.push(...entity.queryAll<T>(props))
    }

    return result
  }

  /**
   * Takes care of manipulating indexes, and updating every internal things
   * related to children spot movements
   * @param where direction and range. (+1) - one up, (-2) - two in direction of array start
   * @param start left-most child to manipulate
   * @param end rightmost child, omit to have only one child moved
   */
  protected move(where: number, start: number, end?: number): IndexUpdate[] {
    if (where === 0) {
      return []
    }

    if (end === undefined) {
      end = start
    }

    const _log = `move(${where}, ${start}, ${end}) | `
    const changesLog: IndexUpdate[] = []
    const children: ChildTrait[] = []
    const childrenUpdated: ChildTrait[] = []

    // Add each child in range, note `children` may have gaps (empties)
    for (const [child] of this.childrenPointers) {
      if (child.idx >= start && child.idx <= end) {
        children[child.idx] = child
      }
    }

    if (where > 0) {
      children.reverse()
    }

    // ------ Validate
    children.forEach((child) => {
      const oldIdx = child.idx
      const newIdx = oldIdx + where

      if (!this.indexFits(newIdx)) {
        throw new Error(`${_log}new index ${newIdx} is out of bounds`)
      }

      // Check if target spot is available
      if (childrenUpdated[newIdx]) {
        throw new Error(
          `${_log}occupied, can't move child ${oldIdx} in place of ${newIdx}`
        )
      }
    })

    // ------ Move
    children.forEach((child) => {
      const oldIdx = child.idx
      const newIdx = oldIdx + where

      changesLog.push({ from: oldIdx, to: newIdx })
      childrenUpdated[oldIdx] = undefined
      childrenUpdated[newIdx] = undefined
      child.idx = newIdx
    })

    return changesLog
  }
}

/**
 * These functions define "Traits defaults",
 * wil be overridden by any "Entity defaults"
 * and in the end by construction-time options
 */
ParentTrait["trait"] = function constructParentTrait(
  state: State,
  options: Partial<ParentTrait> = {}
): void {
  this.childrenPointers = new Map()

  this.collectionBehaviour = def(
    options.collectionBehaviour,
    this.collectionBehaviour,
    "array"
  )
  this.hijacksInteractionTarget = def(
    options.hijacksInteractionTarget,
    this.hijacksInteractionTarget,
    true
  )
  this.maxChildren = def(
    limit(options.maxChildren, 0, Infinity),
    this.maxChildren,
    Infinity
  )

  globalEntitiesContext.registeredChildren.forEach((con) => {
    this[`children${con.name}`] = new ArraySchema()
  })
}
ParentTrait["hooks"] = {
  childAdded: function (this: ParentTrait, child: ChildTrait): void {
    if (this.childAdded) {
      this.childAdded(child)
    }
  },
  childRemoved: function (this: ParentTrait, idx: number): void {
    if (this.childRemoved) {
      this.childRemoved(idx)
    }
  },
}
