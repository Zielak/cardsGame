import { type, ArraySchema } from "@colyseus/schema"
import { logs, def } from "@cardsgame/utils"
import { ChildTrait, getParentEntity } from "./child"
import { State } from "../state"
import { LabelTrait } from "./label"
import { BoxModelTrait } from "./boxModel"
import { FlexyTrait } from "./flexyContainer"
import { LocationTrait } from "./location"
import { OwnershipTrait } from "./ownership"
import { SelectableChildrenTrait } from "./selectableChildren"
import { TwoSidedTrait } from "./twoSided"

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
  // logs.verbose(
  //   `syncing "children${childrenConstructor.name}" in ${parentConstructor.name}`
  // )
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
  return typeof (entity as ParentTrait).childrenPointers !== "undefined"
}

export type ChildAddedHandler = (child: ChildTrait) => void
export type ChildRemovedHandler = (idx: number) => void

export class ParentTrait {
  id: EntityID

  childrenPointers: string[]
  hijacksInteractionTarget: boolean

  childAdded: ChildAddedHandler
  childRemoved: ChildRemovedHandler

  onChildAdded: ChildAddedHandler
  onChildRemoved: ChildRemovedHandler

  constructor(state: State, options: Partial<ParentTrait> = {}) {
    this.childrenPointers = []
    this.hijacksInteractionTarget = true

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
}

export const getKnownConstructor = (entity: ChildTrait) =>
  registeredChildren.find(con => entity instanceof con)

const updateIndexes = (parent: ParentTrait) => {
  parent.childrenPointers = []
  getChildren(parent).forEach((child, newIdx) => {
    const con = registeredChildren.find(con => child instanceof con)
    parent.childrenPointers[newIdx] = con.name
    child.idx = newIdx
  })
}

const pickByIdx = (idx: number) => (child: ChildTrait) => child.idx === idx
const sortByIdx = (a: ChildTrait, b: ChildTrait) => a.idx - b.idx

/**
 * Points out if this element can be target of any interaction
 */
export function isInteractive(state: State, entity) {
  const parent = getParentEntity(state, entity)
  if (parent.hijacksInteractionTarget) {
    return false
  }
  return true
}

export const removeChild = (parent: ParentTrait, id: EntityID): boolean => {
  const idx = getChildren<ChildTrait & LabelTrait>(parent).findIndex(
    child => child.id === id
  )
  return removeChildAt(parent, idx)
}

export function removeChildAt(parent: ParentTrait, idx: number): boolean {
  // ------ check

  if (idx < 0)
    throw new Error(`removeChildAt(): idx must be >= 0, but is ${idx}`)
  if (idx > parent.childrenPointers.length - 1) {
    throw new Error(
      `removeChildAt(): Tried to remove idx out of bounds: 
      ${idx}/${parent.childrenPointers.length}`
    )
  }
  const child: ChildTrait = getChild(parent, idx)
  if (!child) {
    logs.error("removeChildAt", `getChild - I don't have ${idx} child?`)
    return
  }

  // ------ remove

  const targetArrayName = "children" + parent.childrenPointers[idx]
  const targetArray: ArraySchema = parent[targetArrayName]

  const childIdx = targetArray.findIndex(el => el.idx === idx)

  parent.childrenPointers.splice(idx, 1)

  // FIXME: after colyseus/schema geets fixed:
  // https://github.com/colyseus/schema/issues/17
  // https://discordapp.com/channels/525739117951320081/526083188108296202/573204615290683392
  // parent[targetArrayName] = targetArray.filter(el => el !== child)
  const [removedChild] = parent[targetArrayName].splice(childIdx, 1)
  parent.childRemoved && parent.childRemoved(idx)
  updateIndexes(parent)

  if (removedChild !== child) {
    throw new Error("How the fuck did that happen?")
  }

  removedChild.parent = 0

  return true
}

export function moveChildTo(parent: ParentTrait, from: number, to: number) {
  // 1. pluck out the FROM
  const child = getChild(parent, from)
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
      getChild(parent, idx).idx = newIdx
    }
  } else if (from > to) {
    //  0  1  2  3  4  5  6
    // [x, x, x, x, _, x, x]
    //     TO-^     ^-FROM

    //  0   1
    // [To, Fr]
    for (let idx = from - 1; idx >= to; idx--) {
      const newIdx = idx + 1
      getChild(parent, idx).idx = newIdx
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
  updateIndexes(parent)
}

/**
 * Number of child elements
 */
export function countChildren(parent: ParentTrait): number {
  return parent.childrenPointers.length
}

/**
 * Gets all direct children in array form, "sorted" by idx
 */
export function getChildren<T extends ChildTrait>(parent: any): T[] {
  if (!isParent(parent)) {
    return []
  }

  return registeredChildren
    .reduce((prev, con) => {
      prev.push(...parent[`children${con.name}`])
      return prev
    }, [])
    .sort(sortByIdx)
}

/**
 * Get one direct child of `parent` by its `idx`
 */
export function getChild<T extends ChildTrait>(
  parent: ParentTrait,
  idx: number
): T {
  if (!parent.childrenPointers[idx]) {
    throw new Error(`This parent doesn't have "${idx}" children?`)
  }
  return parent["children" + parent.childrenPointers[idx]].find(pickByIdx(idx))
}

/**
 * Get the element with highest 'idx' value
 */
export function getTop<T extends ChildTrait>(parent: ParentTrait): T {
  return getChild<T>(parent, Math.max(0, parent.childrenPointers.length - 1))
}

/**
 * Get the element with the lowest 'idx' value
 */
export function getBottom<T extends ChildTrait>(parent: ParentTrait): T {
  return getChild<T>(parent, 0)
}

/**
 * Recursively fetches all children
 */
export function getDescendants(parent: ParentTrait): ChildTrait[] {
  return getChildren(parent).reduce(
    (prev, entity: ParentTrait | ChildTrait) => {
      prev.push(entity)
      if (isParent(entity)) {
        prev.concat(getDescendants(entity))
      }
      return prev
    },
    []
  )
}

type EveryTrait = BoxModelTrait &
  ChildTrait &
  ParentTrait &
  FlexyTrait &
  LabelTrait &
  LocationTrait &
  OwnershipTrait &
  SelectableChildrenTrait &
  TwoSidedTrait

export interface QuerableProps extends Partial<Omit<EveryTrait, "parent">> {
  parent?: EntityID | QuerableProps
}

const queryRunner = (props: QuerableProps) => entity => {
  const propKeys = Object.keys(props)

  return propKeys.every(propName => {
    return entity[propName] === props[propName]
  })
}

// TODO: TEST IT
export function findAll(parent: ParentTrait, ...props: QuerableProps[]) {
  const result = props.reduce(
    (allParents, currentProps) => {
      return allParents.reduce<(ChildTrait | ParentTrait)[]>(
        (children: ChildTrait[], _parent) => {
          const newMatches = getChildren(_parent).filter(
            queryRunner(currentProps)
          )
          return children.concat(newMatches)
        },
        []
      )
    },
    [parent]
  )
  if (result.length === 0) {
    throw new Error(
      `findAll: couldn't find anything.\nQuery: ${JSON.stringify(props)}`
    )
  }
  return result
}

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

export function find(parent: ParentTrait, ...props: QuerableProps[]) {
  const result = props.reduce(
    (_parent, _props) => getChildren(_parent).find(queryRunner(_props)),
    parent as ChildTrait & ParentTrait
  )

  if (!result) {
    throw new Error(
      `find: couldn't find anything.\nQuery: ${JSON.stringify(props)}`
    )
  }
  return result
}

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
