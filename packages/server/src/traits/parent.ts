import { type, ArraySchema } from "@colyseus/schema"
import { logs, def } from "@cardsgame/utils"
import { ChildTrait } from "./child"
import { State } from "../state"
import { QuerableProps, queryRunner } from "../queryRunner"

const registeredParents: {
  con: Function
  childrenSynced: boolean
}[] = []
const registeredChildren: Function[] = []

const synchChildrenArray = (
  parentConstructor: Function,
  childrenConstructor: Function
) => {
  const arr = []
  arr.push(childrenConstructor)
  logs.verbose(
    `syncing "children${childrenConstructor.name}" in ${parentConstructor.name}`
  )
  type(arr)(parentConstructor.prototype, `children${childrenConstructor.name}`)
}

/**
 * Register as possible child for any other parent enttities
 */
export function canBeChild(childConstructor: Function) {
  // Remember this child type for future classes
  registeredChildren.push(childConstructor)

  // Add this child type to other parents,
  // which wish their children to be synced to client
  registeredParents
    .filter(({ childrenSynced }) => childrenSynced)
    .map(({ con }) => con)
    .forEach(parentConstructor =>
      synchChildrenArray(parentConstructor, childConstructor)
    )
}

/**
 * Remember as possible parent to any kinds of children entities
 * Also enables syncing any previously remembered children kind on this constructor
 * @param childrenSynced set `false` to disable syncing children to clients
 */
export function containsChildren(childrenSynced = true) {
  return function containsChildren(parentConstructor: Function) {
    // Remember this parent
    registeredParents.push({
      con: parentConstructor,
      childrenSynced
    })

    Object.defineProperty(parentConstructor.prototype, "__syncChildren", {
      value: childrenSynced
    })

    // Add all known children kinds to this one
    if (childrenSynced) {
      registeredChildren.forEach(childConstructor =>
        synchChildrenArray(parentConstructor, childConstructor)
      )
    }
  }
}

// ====================

export function isParent(entity: any): entity is ParentTrait {
  return typeof (entity as ParentTrait).hijacksInteractionTarget !== "undefined"
}

export type ChildAddedHandler = (child: ChildTrait) => void
export type ChildRemovedHandler = (idx: number) => void

export class ParentTrait {
  protected childrenPointers: string[]
  hijacksInteractionTarget: boolean

  childAdded: ChildAddedHandler
  childRemoved: ChildRemovedHandler

  onChildAdded: ChildAddedHandler
  onChildRemoved: ChildRemovedHandler

  removeChild(child: ChildTrait): boolean {
    if (child.parent === this) {
      return this.removeChildAt(child.idx)
    } else {
      return false
    }
  }

  removeChildAt(idx: number): boolean {
    // ------ check

    if (idx < 0)
      throw new Error(`removeChildAt(): idx must be >= 0, but is ${idx}`)
    if (idx > this.childrenPointers.length - 1) {
      throw new Error(
        `removeChildAt(): Tried to remove idx out of bounds: 
      ${idx}/${this.childrenPointers.length}`
      )
    }
    const child: ChildTrait = this.getChild(idx)
    if (!child) {
      logs.error("removeChildAt", `getChild - I don't have ${idx} child?`)
      return
    }

    // ------ remove

    const targetArrayName = "children" + this.childrenPointers[idx]
    const targetArray: ArraySchema = this[targetArrayName]

    const childIdx = targetArray.findIndex(el => el.idx === idx)

    this.childrenPointers.splice(idx, 1)

    // TODO: after colyseus/schema geets fixed:
    // https://github.com/colyseus/schema/issues/17
    // https://discordapp.com/channels/525739117951320081/526083188108296202/573204615290683392
    // this[targetArrayName] = targetArray.filter(el => el !== child)
    const [removedChild] = this[targetArrayName].splice(childIdx, 1)
    this.childRemoved && this.childRemoved(idx)
    this.updateIndexes()

    if (removedChild !== child) {
      throw new Error("How the fuck did that happen?")
    }

    removedChild.parent = 0

    return true
  }

  addChild(entity: ChildTrait) {
    if (entity.parent !== undefined) {
      entity.parent.removeChildAt(entity.idx)
    }

    const con = getKnownConstructor(entity)
    const targetArray = this["children" + con.name] as ArraySchema<ChildTrait>
    targetArray.push(entity)

    entity.idx = this.countChildren()
    entity.parent = this
    this.childrenPointers.push(con.name)

    if (this.childAdded) {
      this.childAdded(entity)
    }
  }

  moveChildTo(from: number, to: number) {
    // 1. pluck out the FROM
    const child = this.getChild(from)
    if (!child) {
      throw new Error(`There's no child at index ${from}`)
    }

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
    if (!this.childrenPointers[idx]) {
      throw new Error(`This parent doesn't have "${idx}" children?`)
    }
    return this["children" + this.childrenPointers[idx]].find(pickByIdx(idx))
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

  /**
   * Recursively fetches all children
   */
  getDescendants(): ChildTrait[] {
    return this.getChildren().reduce(
      (prev, entity: ParentTrait | ChildTrait) => {
        prev.push(entity)
        if (isParent(entity)) {
          prev.concat(entity.getDescendants())
        }
        return prev
      },
      []
    )
  }

  find<T>(...props: QuerableProps[]): T {
    const result = props.reduce<T | unknown>((_parent, _props) => {
      if (isParent(_parent)) {
        return _parent.getChildren().find(queryRunner(_props))
      }
    }, this)

    if (!result) {
      throw new Error(
        `find: couldn't find anything.\nQuery: ${JSON.stringify(props)}`
      )
    }
    return result as T
  }

  // TODO: TEST IT
  findAll(...props: QuerableProps[]) {
    const result = props.reduce(
      (allParents, currentProps) => {
        return allParents.reduce<(ChildTrait | ParentTrait)[]>(
          (children: ChildTrait[], _parent) => {
            const newMatches = _parent
              .getChildren()
              .filter(queryRunner(currentProps))
            return children.concat(newMatches)
          },
          []
        )
      },
      [this]
    )
    if (result.length === 0) {
      throw new Error(
        `findAll: couldn't find anything.\nQuery: ${JSON.stringify(props)}`
      )
    }
    return result
  }

  protected updateIndexes() {
    this.childrenPointers = []
    this.getChildren().forEach((child, newIdx) => {
      const con = registeredChildren.find(con => child instanceof con)
      this.childrenPointers[newIdx] = con.name
      child.idx = newIdx
    })
  }
}

;(ParentTrait as any).trait = function ParentTrait(
  state: State,
  options: Partial<ParentTrait> = {}
) {
  this.childrenPointers = []
  this.hijacksInteractionTarget = true

  // FIXME: All these children properties are not tracked
  registeredChildren.forEach(con => {
    if ((this as any).__syncChildren === false) {
      this[`children${con.name}`] = new Array()
    } else {
      this[`children${con.name}`] = new ArraySchema()
    }
  })

  this.onChildAdded = def(options.onChildAdded, undefined)
  this.onChildRemoved = def(options.onChildRemoved, undefined)
}

export const getKnownConstructor = (entity: ChildTrait) =>
  registeredChildren.find(con => entity instanceof con)

const pickByIdx = (idx: number) => (child: ChildTrait) => child.idx === idx
const sortByIdx = (a: ChildTrait, b: ChildTrait) => a.idx - b.idx

// @deprecated unused.
// export function findAllDeep(
//   parent: ParentTrait,
//   ...props: QuerableProps[]
// ): T[] {
//   const result = getDescendants(parent).filter(queryRunner(props))
//   if (result.length === 0) {
//     throw new Error(
//       `findAllDeep: couldn't find anything.\nQuery: ${JSON.stringify(props)}`
//     )
//   }
//   return result
// }

// @deprecated unused anywhere now.
// export function findDeep(parent: ParentTrait, ...props: QuerableProps[]) {
//   const result = getDescendants(parent).find(queryRunner(props))
//   if (!result) {
//     throw new Error(
//       `findDeep: couldn't find anything.\nQuery: ${JSON.stringify(props)}`
//     )
//   }
//   return result
// }
