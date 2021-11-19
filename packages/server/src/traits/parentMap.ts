import { arrayWith, def, limit, logs, sortByIdx } from "@cardsgame/utils"
import { ArraySchema } from "@colyseus/schema"

import { globalEntitiesContext } from "../annotations/entitiesContext"
import type { State } from "../state"

import type { ChildTrait } from "./child"
import { executeHook } from "./entity"
import { query, queryAll } from "./helpers/parentCommons"
import {
  ChildAddedHandler,
  ChildRemovedHandler,
  getKnownConstructor,
  isParent,
  ParentTrait,
} from "./parent"

export function isParentMap(entity: unknown): entity is ParentMapTrait {
  return (
    typeof entity == "object" &&
    typeof (entity as ParentTrait).query !== "undefined" &&
    typeof (entity as ParentTrait).getChildren !== "undefined" &&
    "maxChildren" in entity &&
    typeof entity["maxChildren"] === "number"
  )
}

export class ParentMapTrait implements ParentTrait {
  childrenPointers: Map<ChildTrait, string>
  hijacksInteractionTarget: boolean
  /**
   * @memberof ParentMapTrait
   */
  maxChildren: number

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

    const targetArrayName = `children${this.childrenPointers.get(child)}`

    const targetArray: ArraySchema = this[targetArrayName]

    const childIdx = targetArray.findIndex((el) => el.idx === idx)

    this.childrenPointers.delete(child)

    const removedChild = this[targetArrayName].splice(
      childIdx,
      1
    )[0] as ChildTrait

    if (removedChild !== child) {
      throw new Error("How the fuck did that happen?")
    }

    executeHook.call(this, "childRemoved", idx)

    removedChild.parent = undefined

    return true
  }

  addChild(entity: ChildTrait): void
  addChild(entity: ChildTrait, prepend: boolean): void
  addChild(entity: ChildTrait, index: number): void
  addChild(entity: ChildTrait, arg1?: boolean | number): void {
    // Ensure this parent still has space
    if (this.isIndexOutOfBounds(this.countChildren())) {
      throw new Error(`addChild(), limit reached: ${this.maxChildren}`)
    }

    if (entity.parent !== undefined) {
      entity.parent.removeChildAt(entity.idx)
    }

    const childrenCount = this.countChildren()

    if (arg1 === true) {
      // Prepend = true (yuk)
      const target = this.getFirstEmptySpot()

      for (let i = target - 1; i >= 0; i--) {
        const child = this.getChild(i)
        if (!child) {
          continue
        }
        const oldIdx = child.idx
        child.idx += 1
        executeHook.call(this, "childIndexUpdated", oldIdx, child.idx)
      }
      entity.idx = 0
    } else if (typeof arg1 === "number") {
      if (this.isIndexOutOfBounds(arg1)) {
        throw new Error(
          `addChild(), trying to place item out of bounds: desired:${arg1}, max:${this.maxChildren}`
        )
      }
      // Want to place entity in certain index spot
      if (!this.getChild(arg1)) {
        entity.idx = arg1
      } else {
        throw new Error(`addChild(), spot ${arg1} is already occupied`)
        // I can't assume author would want that.
        // entity.idx = this.getClosestEmptySpot(arg1)
      }
    } else if (typeof arg1 === "undefined") {
      // Just put it anywhere
      if (childrenCount === 0) {
        // No children here yet
        entity.idx = 0
      } else {
        // Or squeeze it in the first available spot
        const newIndex = this.getFirstEmptySpot()
        if (newIndex < 0) {
          throw new Error(
            `addChild(), shouldn't happen! can't actually find any empty spot`
          )
        }

        entity.idx = newIndex
      }
    }

    entity.parent = this

    const con = getKnownConstructor(entity)
    const targetArray = this[`children${con.name}`] as ArraySchema<ChildTrait>
    targetArray.push(entity)

    this.childrenPointers.set(entity, con.name)

    executeHook.call(this, "childAdded", entity)
  }

  addChildren(entities: ChildTrait[]): void {
    entities.forEach((entity) => this.addChild(entity))
  }

  /**
   * This works more like "swap children", but whateva
   */
  moveChildTo(from: number, to: number): void {
    const max =
      this.maxChildren !== Infinity
        ? this.maxChildren - 1
        : this.countChildren() - 1
    from = limit(from, 0, max)
    to = limit(to, 0, max)

    const childA = this.getChild(from)
    const childB = this.getChild(to)

    if (childA) {
      childA.idx = to
      executeHook.call(this, "childIndexUpdated", from, to)
    }

    if (childB) {
      childB.idx = from
      executeHook.call(this, "childIndexUpdated", to, from)
    }
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

    return globalEntitiesContext.registeredChildren
      .reduce((prev, con) => {
        prev.push(...this[`children${con.name}`])
        return prev
      }, [])
      .sort(sortByIdx)
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
    return this.getChildren<T>()[Math.max(0, this.childrenPointers.size - 1)]
  }

  /**
   * Get the element with the lowest 'idx' value
   */
  getBottom<T extends ChildTrait>(): T {
    return this.getChildren<T>()[0]
  }

  getFirstEmptySpot(): number {
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
      if (!this.isIndexOutOfBounds(left) && !allSpots[left]) {
        return left
      } else if (!this.isIndexOutOfBounds(right) && !allSpots[right]) {
        return right
      }
    }
    // I don't know
    return -1
  }

  isIndexOutOfBounds(index: number): boolean {
    return (
      index < 0 ||
      (this.maxChildren >= 0 &&
        this.maxChildren !== Infinity &&
        index >= this.maxChildren)
    )
  }
}

export interface ParentMapTrait extends ParentTrait {}

ParentMapTrait.prototype.query = query
ParentMapTrait.prototype.queryAll = queryAll
ParentMapTrait["trait"] = function constructParentMapTrait(
  state: State,
  options: Partial<ParentMapTrait> = {}
): void {
  this.childrenPointers = new Map()

  this.hijacksInteractionTarget = def(
    options.hijacksInteractionTarget,
    this.hijacksInteractionTarget,
    true
  )
  this.maxChildren = def(options.maxChildren, this.maxChildren, Infinity)

  globalEntitiesContext.registeredChildren.forEach((con) => {
    if (this.__syncChildren === false) {
      this[`children${con.name}`] = []
    } else {
      this[`children${con.name}`] = new ArraySchema()
    }
  })
}
ParentMapTrait["hooks"] = {
  childAdded: function (this: ParentMapTrait, child: ChildTrait): void {
    if (this.childAdded) {
      this.childAdded(child)
    }
  },
  childRemoved: function (this: ParentMapTrait, idx: number): void {
    if (this.childRemoved) {
      this.childRemoved(idx)
    }
  },
}
