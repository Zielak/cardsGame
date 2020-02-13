import { ArraySchema } from "@colyseus/schema"
import { logs, def, limit } from "@cardsgame/utils"

import { registeredChildren } from "../annotations"
import { State } from "../state"

import { ChildTrait } from "./child"
import { executeHook } from "./entity"
import {
  ParentTrait,
  ChildAddedHandler,
  ChildRemovedHandler,
  getKnownConstructor,
  isParent,
  pickByIdx,
  query,
  queryAll,
  sortByIdx
} from "./parent"

export class ParentArrayTrait implements ParentTrait {
  childrenPointers: string[]
  hijacksInteractionTarget: boolean

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
    // if (idx > this.childrenPointers.length - 1) {
    //   throw new Error(
    //     `removeChildAt(): Tried to remove idx out of bounds:
    //   ${idx}/${this.childrenPointers.length}`
    //   )
    // }
    const child: ChildTrait = this.getChild(idx)
    if (!child) {
      logs.error("removeChildAt", `getChild - I don't have ${idx} child?`)
      return false
    }

    // ------ remove

    const targetArrayName = "children" + this.childrenPointers[idx]

    const targetArray: ArraySchema = this[targetArrayName]

    const childIdx = targetArray.findIndex(el => el.idx === idx)

    this.childrenPointers.splice(idx, 1)

    const removedChild = this[targetArrayName].splice(
      childIdx,
      1
    )[0] as ChildTrait

    if (removedChild !== child) {
      throw new Error("How the fuck did that happen?")
    }

    executeHook.call(this, "childRemoved", idx)
    this.updateIndexes()

    removedChild.parent = undefined

    return true
  }

  addChild(entity: ChildTrait, prepend = false): void {
    if (entity.parent !== undefined) {
      entity.parent.removeChildAt(entity.idx)
    }

    const con = getKnownConstructor(entity)
    const targetArray = this["children" + con.name] as ArraySchema<ChildTrait>
    targetArray[prepend ? "unshift" : "push"](entity)

    if (prepend) {
      entity.idx = -1
      this.getChildren().forEach((child, idx) => {
        child.idx = idx
      })
    } else {
      entity.idx = this.countChildren()
    }

    entity.parent = this
    this.childrenPointers[prepend ? "unshift" : "push"](con.name)

    executeHook.call(this, "childAdded", entity)
  }

  moveChildTo(from: number, to: number) {
    // 1. pluck out the FROM
    const child = this.getChild(from)
    if (!child) {
      throw new Error(`There's no child at index ${from}`)
    }

    to = limit(to, 0, this.countChildren() - 1)

    // 2. keep moving from 3->2, to->3
    if (from < to) {
      //  0  1  2  3  4  5  6
      // [x, x, _, x, x, x, x]
      //   FROM-^     ^-TO

      //  0   1
      // [Fr, To]
      for (let idx = from + 1; idx <= to; idx++) {
        const newIdx = idx - 1
        this.getChild(idx).idx = newIdx
      }
    } else if (from > to) {
      //  0  1  2  3  4  5  6
      // [x, x, x, x, _, x, x]
      //     TO-^     ^-FROM

      //  0   1
      // [To, Fr]
      for (let idx = from - 1; idx >= to; idx--) {
        const newIdx = idx + 1
        this.getChild(idx).idx = newIdx
      }
    } else {
      logs.verbose(
        `moveChildTo()`,
        `you were trying to move to the same index:`,
        from,
        "=>",
        to
      )
      return
    }

    // 3. plop entry to desired target place
    child.idx = to

    // const entries = getChildren(parent).map(child => chalk.yellow(child.name))

    // logs.verbose(`moveChildTo, [`, entries.join(", "), `]`)
    // logs.verbose(`moveChildTo, done, now updatePointers()`)
    this.updateIndexes()
  }

  /**
   * Number of child elements
   */
  countChildren(): number {
    return this.childrenPointers.length
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
    const targetArray = this["children" + this.childrenPointers[idx]]
    return targetArray && targetArray.find(pickByIdx(idx))
  }

  /**
   * Get the element with highest 'idx' value
   */
  getTop<T extends ChildTrait>(): T {
    return this.getChild<T>(Math.max(0, this.childrenPointers.length - 1))
  }

  /**
   * Get the element with the lowest 'idx' value
   */
  getBottom<T extends ChildTrait>(): T {
    return this.getChild<T>(0)
  }

  protected updateIndexes(): void {
    this.childrenPointers = []

    this.getChildren().forEach((child, newIdx) => {
      const con = registeredChildren.find(con => child instanceof con)
      const prevIndex = child.idx

      this.childrenPointers[newIdx] = con.name

      child.idx = newIdx
      if (prevIndex !== newIdx) {
        executeHook.call(this, "childIndexUpdated", prevIndex, newIdx)
      }
    })
  }
}

export interface ParentArrayTrait extends ParentTrait {}

ParentArrayTrait.prototype.query = query
ParentArrayTrait.prototype.queryAll = queryAll
;(ParentArrayTrait as any).trait = function ParentArrayTrait(
  state: State,
  options: Partial<ParentArrayTrait> = {}
): void {
  this.childrenPointers = []

  this.hijacksInteractionTarget = def(
    options.hijacksInteractionTarget,
    this.hijacksInteractionTarget,
    true
  )

  registeredChildren.forEach(con => {
    if ((this as any).__syncChildren === false) {
      this[`children${con.name}`] = []
    } else {
      this[`children${con.name}`] = new ArraySchema()
    }
  })
}
;(ParentArrayTrait as any).hooks = {
  childAdded: function(this: ParentArrayTrait, child: ChildTrait): void {
    if (this.childAdded) {
      this.childAdded(child)
    }
  },
  childRemoved: function(this: ParentArrayTrait, idx: number): void {
    if (this.childRemoved) {
      this.childRemoved(idx)
    }
  }
}
