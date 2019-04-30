import { IEntity, getParentEntity, resetWorldTransform } from "./entity"
import { logs } from "../../logs"
import { EntityTransformData } from "../../transform"
import { type, ArraySchema } from "@colyseus/schema"
import chalk from "chalk"
import { Player } from "../../player"
import { IIdentity } from "./identity"

const reegisteredChildren: Function[] = []

export function containsChildren(newEntity: Function) {
  // Add all known entities to this one
  reegisteredChildren.forEach(con => {
    const arr = []
    arr.push(con)
    type(arr)(newEntity.prototype, `children${con.name}`)
  })
}

export function canBeChild(newEntity: Function) {
  // Remember this entity type for future classes
  reegisteredChildren.push(newEntity)

  //  Add this newEntity type to every other known entities
  reegisteredChildren.forEach(con => {
    const arr = []
    arr.push(newEntity)
    type(arr)(con.prototype, `children${newEntity.name}`)
  })
}

// ====================

export interface IParent extends IIdentity {
  _childrenPointers: string[]
  hijacksInteractionTarget: boolean
  isParent(): this is IParent

  // FIXME: TS doesn't enforce return type of EntityTransformData
  restyleChild?: (
    child: IEntity,
    idx: number,
    array: IEntity[]
  ) => EntityTransformData

  onChildAdded?(child: IEntity): void
  onChildRemoved?(idx: number): void
}

export function ParentConstructor(entity: IParent) {
  entity._childrenPointers = []
  reegisteredChildren.forEach(con => {
    entity[`children${con.name}`] = []
  })
}

const getKnownConstructor = (entity: IEntity | IParent) =>
  reegisteredChildren.find(con => entity instanceof con)

const updateChildrenIdx = (parent: IParent, from: number = 0) => {
  const max = countChildren(parent)
  for (let i = from + 1; i <= max; i++) {
    const array = parent[parent._childrenPointers[i]] as ArraySchema<IEntity>
    const child = array.find(el => el.idx === i)
    child.idx = i - 1
  }
  updatePointers(parent)
}

const updatePointers = (parent: IParent) => {
  getChildren(parent).forEach(child => {
    const con = reegisteredChildren.find(con => child instanceof con)
    parent._childrenPointers[child.idx] = con.name
  })
}

export function addChild(parent: IParent, child: IEntity, idx?: number) {
  // ----- check

  if (child === (parent as IParent & IEntity)) {
    throw new Error(`adding itself as a child makes no sense.`)
  }

  const lastParent =
    typeof child.parent !== "number" ? undefined : getParentEntity(child)

  if (lastParent) {
    // Remember to remove myself from first parent
    removeChild(lastParent, child.id)
  }

  // ----- add

  // const added = entity._children.add(child)

  const con = getKnownConstructor(child)
  if (!con) {
    throw new Error(
      `addChild(), this type of child is unknown to me: ${child.type}.`
    )
  }

  const targetArray = parent["children" + con.name]

  // Check if it's already in
  if (targetArray.includes(child)) {
    logs.warn("addChild()", `Child is already here`)
    return
  }

  const newIdx = countChildren(parent)
  targetArray.push(child)
  child.idx = newIdx
  parent._childrenPointers.push(con.name)

  // Lazy solution, is it enough?
  if (typeof idx == "number") {
    moveChildTo(parent, newIdx, idx)
  }

  child.parent = parent.id

  if (parent.onChildAdded) parent.onChildAdded(child)
  restyleChildren(parent)
}

export function addChildren(parent: IParent & IEntity, children: IEntity[]) {
  children.forEach(newChild => addChild(parent, newChild))
}

export const removeChild = (parent: IParent, id: EntityID): boolean => {
  const idx = getChildren(parent).findIndex(child => child.id === id)
  return removeChildAt(parent, idx)
}

export function removeChildAt(parent: IParent, idx: number): boolean {
  // ------ check

  if (idx < 0)
    throw new Error(`removeChildAt(): idx must be >= 0, but is ${idx}`)
  if (idx > parent._childrenPointers.length - 1) {
    logs.warn(
      "removeChildAt()",
      `Tried to remove idx out of bounds:`,
      idx,
      "/",
      parent._childrenPointers.length
    )
  }
  const child: IEntity = getChild(parent, idx)
  if (!child) {
    logs.error("removeChildAt", `getChild - I don't have ${idx} child?`)
    return
  }

  // ------ remove

  const targetArrayName = "children" + parent._childrenPointers[idx]
  const targetArray: IEntity[] = parent[targetArrayName]
  parent[targetArrayName] = targetArray.filter(el => el !== child)
  parent._childrenPointers[idx] = undefined
  child.parent = 0

  // ------ update

  updateChildrenIdx(parent, idx)

  // Reset last parent's stylings
  resetWorldTransform(child)
  restyleChildren(parent)

  return true
}

export function moveChildTo(parent: IParent, from: number, to: number) {
  const child = getChild(parent, from)

  // 1. pluck out the FROM
  // 2. keep moving from 3->2, to->3
  // 3. plop entry at empty TO

  if (from < to) {
    //  0  1  2  3  4  5  6
    // [x, x, _, x, x, x, x]
    //   from-^     ^-to

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
    logs.warn(
      `moveChildTo()`,
      `you were trying to move to the same index:`,
      from,
      "=>",
      to
    )
  }
  // Plop entry to desired target place
  child.idx = to

  const entries = getChildren(parent).map(child => chalk.yellow(child.name))

  logs.verbose(`moveChildTo, [`, entries.join(", "), `]`)
  logs.verbose(`moveChildTo, done, now updatePointers()`)
  updatePointers(parent)
}

export function restyleChildren(parent: IParent) {
  if (!parent.restyleChild) return
  getChildren(parent).forEach(
    (child: IEntity, idx: number, array: IEntity[]) => {
      const data = parent.restyleChild(child, idx, array)
      if (data.x) {
        child._worldTransform.x = data.x
      }
      if (data.y) {
        child._worldTransform.y = data.y
      }
      if (data.angle) {
        child._worldTransform.angle = data.angle
      }
    },
    this
  )
}

/**
 * Number of child elements
 */
export function countChildren(parent: IParent | IEntity): number {
  return parent.isParent() ? parent._childrenPointers.length : 0
}

/**
 * Gets all direct children in array form, "sorted" by idx
 */
export function getChildren<T extends IEntity | IParent>(
  parent: IParent | IEntity
): (T & IEntity)[] {
  if (parent.isParent()) {
    return parent._childrenPointers.map((name, idx) =>
      parent["children" + name].find((e: IEntity) => e.idx === idx)
    )
  }
  return []
}

/**
 * Get one direct child of `parent`
 */
export function getChild<T extends IEntity>(
  parent: IParent,
  idx: number
): T & IEntity {
  return parent["children" + parent._childrenPointers[idx]].find(
    (child: IEntity) => child.idx === idx
  )
}

/**
 * Get the element with highest 'idx' value
 */
export function getTop<T extends IEntity | IParent>(parent: IParent): T {
  return parent[
    "children" + parent._childrenPointers[parent._childrenPointers.length - 1]
  ]
}

/**
 * Get the element with the lowest 'idx' value
 */
export function getBottom<T extends IEntity | IParent>(parent: IParent): T {
  return parent["children" + parent._childrenPointers[0]]
}

/**
 * Recursively fetches all children
 */
export function getDescendants<T extends IEntity | IParent>(
  parent: IParent
): T[] {
  return getChildren(parent).reduce((prev, entity) => {
    prev.push(entity)
    if (entity.isParent()) {
      prev.concat(getDescendants(entity))
    }
    return prev
  }, [])
}

// /**
//  * Function to be used in sorting.
//  */
// export function byIdx<T extends IEntity>(a: T, b: T): number {
//   return a.idx - b.idx
// }

const queryRunner = (props: QuerableProps) => (entity: IEntity | IParent) => {
  const propKeys = Object.keys(props)

  return propKeys.every(propName => {
    return entity[propName] === props[propName]
  })
}

interface QueryOptions {
  deep: boolean
  one: boolean
}

interface QuerableProps {
  id?: EntityID

  idx?: number
  parent?: EntityID | QuerableProps
  owner?: Player

  type?: string
  name?: string

  [key: string]: any
}

export function findAll<T extends IEntity>(
  parent: IParent,
  props: QuerableProps,
  options?: QueryOptions
): T[] {
  const result = (options.deep
    ? getDescendants<T>(parent)
    : getChildren<T>(parent)
  ).filter(queryRunner(props))
  if (result.length === 0) {
    throw new Error(
      `findAll: couldn't find anything.\nQuery: ${JSON.stringify(props)}`
    )
  }
  return result
}

export function find<T extends IEntity | IParent>(
  parent: IParent,
  props: QuerableProps,
  options?: QueryOptions
): T {
  const result = (options.deep
    ? getDescendants<T>(parent)
    : getChildren<T>(parent)
  ).find(queryRunner(props))
  if (!result) {
    throw new Error(
      `find: couldn't find anything.\nQuery: ${JSON.stringify(props)}`
    )
  }
  return result
}
