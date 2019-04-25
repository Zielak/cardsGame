import { Children } from "../children"
import { IEntity, getParentEntity, resetWorldTransform } from "../entity"
import { logs } from "../../logs"
import { EntityTransformData } from "../../transform"
import { State } from "../../state"

export interface IParent extends IEntity {
  _children: Children
  hijacksInteractionTarget: boolean

  // FIXME: TS doesn't enforce return type of EntityTransformData
  restyleChild: (
    child: IEntity,
    idx: number,
    array: IEntity[]
  ) => EntityTransformData

  onChildAdded?(child: IEntity): void
  onChildRemoved?(idx: number): void
}

export function addChild(entity: IParent, child: IEntity) {
  if (child === entity) {
    throw new Error(`adding itself as a child makes no sense.`)
  }

  const lastParent =
    typeof child.parent !== "number" ? undefined : getParentEntity(child)

  if (lastParent) {
    // Remember to remove myself from first parent
    removeChild(lastParent, child.id, true)
  }

  const added = entity._children.add(child)
  if (!added) {
    throw new Error(`EntityMap, couldn't add new child! ${child.type}`)
  }
  child.parent = entity.id

  restyleChildren(entity)
}

export function addChildren(entity: IEntity & IParent, children: IEntity[]) {
  children.forEach(newChild => addChild(entity, newChild))
}

// TODO:
export function addChildAt(entity: IParent, child: IEntity, idx: number) {}

export const removeChild = (
  entity: IEntity & IParent,
  id: EntityID,
  _silent: boolean = false
): boolean => {
  const idx = entity._children.toArray().findIndex(child => child.id === id)
  return removeChildAt(entity, idx, _silent)
}

export function removeChildAt(
  entity: IEntity & IParent,
  idx: number,
  _silent: boolean = false
): boolean {
  // TODO: These checks should probably be in EntityMap.
  if (idx < 0)
    throw new Error(`removeChildAt - idx must be >= 0, but is ${idx}`)
  if (idx > entity._children.length - 1) {
    logs.warn(
      "removeChildAt()",
      `Tried to remove idx out of bounds:`,
      idx,
      "/",
      entity._children.length
    )
  }
  const child: IEntity = entity._children.get(idx)
  if (!child) {
    logs.error("removeChildAt", `children.get - I don't have ${idx} child?`)
    return
  }

  if (!entity._children.remove(idx)) {
    logs.error("removeChildAt", `children.remove - I don't have ${idx} child?`)
    return
  }
  child.parent = 0

  // Reset last parent's stylings
  resetWorldTransform(child)
  restyleChildren(entity)

  return true
}

export function restyleChildren(entity: IParent) {
  entity._children
    .toArray()
    .forEach((child: IEntity, idx: number, array: IEntity[]) => {
      const data = entity.restyleChild(child, idx, array)
      if (data.x) {
        child._worldTransform.x = data.x
      }
      if (data.y) {
        child._worldTransform.y = data.y
      }
      if (data.angle) {
        child._worldTransform.angle = data.angle
      }
    }, this)
}

export function countChildren(entity: IParent): number {
  if (!entity._children) return 0
  return entity._children.length
}

export function getChild<T extends IEntity>(entity: IParent, idx: number): T {
  if (!entity._children) return
  return entity._children.get<T>(idx)
}

/**
 * Gets all children in array form, "sorted" by idx
 */
export function childrenArray(entity: IParent) {
  return entity._children.toArray()
}

/**
 * Number of child elements
 */
export function childrenCount(entity: IParent) {
  return entity._children.length
}

/**
 * Get the element with highest 'idx' value
 */
export function getTop<T extends IEntity>(entity: IParent): T {
  return entity._children.get<T>(entity._children.length - 1)
}

/**
 * Get the element with the lowest 'idx' value
 */
export function getBottom<T extends IEntity>(parent: IParent): T {
  return parent._children[0]
}

/**
 * Function to be used in sorting.
 */
export function byIdx<T extends IEntity>(a: T, b: T): number {
  return a.idx - b.idx
}

export function arrayOfChildren(entity: IParent): IEntity[] {
  return entity._children.toArray()
}

const byName = (name: string) => (entity: IEntity): boolean =>
  entity.name === name

const byType = (type: string) => (entity: IEntity): boolean =>
  entity.type === type

export function filterByName(entity: IParent, name: string): IEntity[]
export function filterByName(state: State, name: string): IEntity[]
export function filterByName(parent: IParent | State, name: string): IEntity[] {
  if (parent instanceof State) {
    return parent.entities.toArray().filter(byName(name))
  }
  return parent._children.toArray().filter(byName(name))
}

export function findByName(entity: IParent, name: string): IEntity
export function findByName(state: State, name: string): IEntity
export function findByName(parent: IParent | State, name: string): IEntity {
  if (parent instanceof State) {
    return parent.entities.toArray().find(byName(name))
  }
  return parent._children.toArray().find(byName(name))
}

export function filterByType(entity: IParent, type: string): IEntity[]
export function filterByType(state: State, type: string): IEntity[]
export function filterByType(parent: IParent | State, type: string): IEntity[] {
  if (parent instanceof State) {
    return parent.entities.toArray().filter(byType(name))
  }
  return parent._children.toArray().filter(byType(type))
}

export function findByType(entity: IParent, type: string): IEntity
export function findByType(state: State, type: string): IEntity
export function findByType(parent: IParent | State, type: string): IEntity {
  if (parent instanceof State) {
    return parent.entities.toArray().find(byType(type))
  }
  return parent._children.toArray().find(byType(type))
}
