import { type, ArraySchema } from "@colyseus/schema"
import { IEntity, resetWorldTransform } from "./entity"
import { logs } from "../logs"
import { EntityTransform } from "../transform"
import { Player } from "../player"
import { IIdentity } from "./identity"

const registeredParents: Function[] = []
const registeredChildren: Function[] = []

const applyRegisteredChildren = (parentCon: Function, childCon?: Function) => {
  const go = con => {
    const arr = []
    arr.push(con)
    logs.log(`applying "children${con.name}" to ${parentCon.name}`)
    type(arr)(parentCon.prototype, `children${con.name}`)
  }
  if (childCon) {
    go(childCon)
  } else {
    registeredChildren.forEach(go)
  }
}

export function canBeChild(childCon: Function) {
  // Remember this child type for future classes
  registeredChildren.push(childCon)

  // Add this child type to every other known parents
  registeredParents.forEach(parentCon =>
    applyRegisteredChildren(parentCon, childCon)
  )
}

export function containsChildren(parentCon: Function) {
  // Remember this parent
  registeredParents.push(parentCon)

  // Add all known children kinds to this one
  applyRegisteredChildren(parentCon)
}

// ====================

export interface IParent extends IIdentity {
  _childrenPointers: string[]
  hijacksInteractionTarget: boolean
  isParent(): this is IParent

  onChildAdded?(child: IEntity): void
  onChildRemoved?(idx: number): void
}

export function ParentConstructor(entity: IParent) {
  entity._childrenPointers = []
  registeredChildren.forEach(con => {
    entity[`children${con.name}`] = new ArraySchema()
  })
}

export const getKnownConstructor = (entity: IEntity | IParent) =>
  registeredChildren.find(con => entity instanceof con)

const updateIndexes = (parent: IParent) => {
  parent._childrenPointers = []
  getChildren(parent).forEach((child, newIdx) => {
    const con = registeredChildren.find(con => child instanceof con)
    parent._childrenPointers[newIdx] = con.name
    child.idx = newIdx
  })
}

const pickByIdx = (idx: number) => (child: IEntity) => child.idx === idx
const sortByIdx = (a: IEntity, b: IEntity) => a.idx - b.idx

export const removeChild = (parent: IParent, id: EntityID): boolean => {
  const idx = getChildren(parent).findIndex(child => child.id === id)
  return removeChildAt(parent, idx)
}

export function removeChildAt(parent: IParent, idx: number): boolean {
  // ------ check

  if (idx < 0)
    throw new Error(`removeChildAt(): idx must be >= 0, but is ${idx}`)
  if (idx > parent._childrenPointers.length - 1) {
    throw new Error(
      `removeChildAt(): Tried to remove idx out of bounds: 
      ${idx}/${parent._childrenPointers.length}`
    )
  }
  const child: IEntity = getChild(parent, idx)
  if (!child) {
    logs.error("removeChildAt", `getChild - I don't have ${idx} child?`)
    return
  }

  // ------ remove

  const targetArrayName = "children" + parent._childrenPointers[idx]
  const targetArray: ArraySchema = parent[targetArrayName]

  const childIdx = targetArray.findIndex(el => el.idx === idx)

  // FIXME: after colyseus/schema geets fixed:
  // https://github.com/colyseus/schema/issues/17
  // https://discordapp.com/channels/525739117951320081/526083188108296202/573204615290683392
  // parent[targetArrayName] = targetArray.filter(el => el !== child)
  const [removedChild] = parent[targetArrayName].splice(childIdx, 1)
  updateIndexes(parent)

  if (removedChild !== child) {
    throw new Error("How the fuck did that happen?")
  }

  removedChild.parent = 0

  // ------ update

  // Reset last parent's stylings
  resetWorldTransform(removedChild)

  return true
}

export function moveChildTo(parent: IParent, from: number, to: number) {
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
export function countChildren(parent: IParent | IEntity): number {
  return parent.isParent() ? parent._childrenPointers.length : 0
}

/**
 * Gets all direct children in array form, "sorted" by idx
 */
export function getChildren<T extends IEntity | IParent>(
  parent: IParent | IEntity
): (T & IEntity)[] {
  if (!parent.isParent()) {
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
export function getChild<T extends IEntity | IParent>(
  parent: IParent,
  idx: number
): T & IEntity {
  return parent["children" + parent._childrenPointers[idx]].find(pickByIdx(idx))
}

/**
 * Get the element with highest 'idx' value
 */
export function getTop<T extends IEntity | IParent>(parent: IParent): T {
  return getChild<T>(parent, Math.max(0, parent._childrenPointers.length - 1))
}

/**
 * Get the element with the lowest 'idx' value
 */
export function getBottom<T extends IEntity | IParent>(parent: IParent): T {
  return getChild<T>(parent, 0)
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

interface QuerableProps {
  id?: EntityID

  idx?: number
  parent?: EntityID | QuerableProps
  owner?: Player

  type?: string
  name?: string

  [key: string]: any
}

const queryRunner = (props: QuerableProps) => (entity: IEntity | IParent) => {
  const propKeys = Object.keys(props)

  return propKeys.every(propName => {
    return entity[propName] === props[propName]
  })
}

// TODO: TEST IT
export function findAll<T extends IEntity | IParent>(
  parent: IParent,
  ...props: QuerableProps[]
): T[] {
  const result = props.reduce<T[]>(
    (_parents, _props) => {
      return _parents.reduce((children, _parent) => {
        const newMatches = getChildren<T>(_parent).filter(queryRunner(_props))
        return children.concat(newMatches)
      }, [])
    },
    [parent as T]
  )
  if (result.length === 0) {
    throw new Error(
      `findAll: couldn't find anything.\nQuery: ${JSON.stringify(props)}`
    )
  }
  return result
}

export function findAllDeep<T extends IEntity | IParent>(
  parent: IParent,
  ...props: QuerableProps[]
): T[] {
  const result = getDescendants<T>(parent).filter(queryRunner(props))
  if (result.length === 0) {
    throw new Error(
      `findAllDeep: couldn't find anything.\nQuery: ${JSON.stringify(props)}`
    )
  }
  return result
}

export function find<T extends IEntity | IParent>(
  parent: IParent,
  ...props: QuerableProps[]
): T {
  const result = props.reduce<T>(
    (_parent, _props) => getChildren<T>(_parent).find(queryRunner(_props)),
    parent as T
  )
  if (!result) {
    throw new Error(
      `find: couldn't find anything.\nQuery: ${JSON.stringify(props)}`
    )
  }
  return result
}

export function findDeep<T extends IEntity | IParent>(
  parent: IParent,
  props: QuerableProps[]
): T {
  const result = getDescendants<T>(parent).find(queryRunner(props))
  if (!result) {
    throw new Error(
      `findDeep: couldn't find anything.\nQuery: ${JSON.stringify(props)}`
    )
  }
  return result
}
