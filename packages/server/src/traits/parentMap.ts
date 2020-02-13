import { ArraySchema } from "@colyseus/schema"
import { logs, def, limit } from "@cardsgame/utils"

import { ChildTrait } from "./child"
import { State } from "../state"
import { registeredChildren } from "../annotations"
import { executeHook } from "./entity"
import {
  ParentTrait,
  ChildAddedHandler,
  ChildRemovedHandler,
  getKnownConstructor,
  isParent,
  sortByIdx,
  query,
  queryAll
} from "./parent"

export class ParentMapTrait implements ParentTrait {
  childrenPointers: Map<ChildTrait, string>
  hijacksInteractionTarget: boolean
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

    // if (idx < 0)
    //   throw new Error(`removeChildAt(): idx must be >= 0, but is ${idx}`)

    const child: ChildTrait = this.getChild(idx)
    if (!child) {
      logs.error("removeChildAt", `getChild - I don't have ${idx} child?`)
      return false
    }

    // ------ remove

    const targetArrayName = "children" + this.childrenPointers.get(child)

    const targetArray: ArraySchema = this[targetArrayName]

    const childIdx = targetArray.findIndex(el => el.idx === idx)

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

  /**
   * Adds item to last OR last available space
   */
  addChild(entity: ChildTrait, prepend = false): void {
    // Ensure this parent still has space
    if (this.maxChildren >= 0 && this.countChildren() >= this.maxChildren) {
      throw new Error(`addChild(), limit reached: ${this.maxChildren}`)
    }

    if (entity.parent !== undefined) {
      entity.parent.removeChildAt(entity.idx)
    }

    const con = getKnownConstructor(entity)
    const targetArray = this["children" + con.name] as ArraySchema<ChildTrait>
    targetArray[prepend ? "unshift" : "push"](entity)

    if (prepend) {
      const target = this.getFirstEmptySpot()
      for (let i = target; i > 0; i--) {
        this.moveChildTo(i, i - 1)
      }
      entity.idx = 0
    } else {
      const childrenCount = this.countChildren()
      const top = this.getTop()

      if (childrenCount === 0) {
        // No children here yet
        entity.idx = 0
      } else if (top && top.idx < this.maxChildren - 1) {
        // Place it next to the last child

        entity.idx = childrenCount
      } else {
        // Or squeeze it in last possible position,
        // pushing other children down
        const target = this.getLastEmptySpot()

        for (let i = target; i < childrenCount - 1; i++) {
          this.moveChildTo(i + 1, i)
        }
        entity.idx = childrenCount - 1
      }
    }

    entity.parent = this
    this.childrenPointers.set(entity, con.name)

    executeHook.call(this, "childAdded", entity)
  }

  /**
   * This works more like "swap children", but whateva
   */
  moveChildTo(from: number, to: number) {
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

    return registeredChildren
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
    return this.getChildren<T>().find(child => child.idx === idx)
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
    if (bottom && bottom.idx !== 0) {
      return 0
    }

    const max =
      this.maxChildren !== Infinity ? this.maxChildren : this.countChildren()

    for (let i = 0; i < max; i++) {
      if (!this.getChild(i)) {
        return i
      }
    }
    return -1
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
}

export interface ParentMapTrait extends ParentTrait {}

ParentMapTrait.prototype.query = query
ParentMapTrait.prototype.queryAll = queryAll
;(ParentMapTrait as any).trait = function ParentMapTrait(
  state: State,
  options: Partial<ParentMapTrait> = {}
) {
  this.childrenPointers = new Map()

  this.hijacksInteractionTarget = def(
    options.hijacksInteractionTarget,
    this.hijacksInteractionTarget,
    true
  )
  this.maxChildren = def(options.maxChildren, this.maxChildren, Infinity)

  registeredChildren.forEach(con => {
    if ((this as any).__syncChildren === false) {
      this[`children${con.name}`] = []
    } else {
      this[`children${con.name}`] = new ArraySchema()
    }
  })
}
;(ParentMapTrait as any).hooks = {
  childAdded: function(this: ParentMapTrait, child: ChildTrait) {
    if (this.childAdded) {
      this.childAdded(child)
    }
  },
  childRemoved: function(this: ParentMapTrait, idx: number) {
    if (this.childRemoved) {
      this.childRemoved(idx)
    }
  }
}
