import { ChildTrait } from "./child"
import { QuerableProps, queryRunner } from "../queryRunner"
import { registeredChildren } from "../annotations"

export function isParent(entity: any): entity is ParentTrait {
  return (
    typeof entity == "object" &&
    typeof (entity as ParentTrait).query !== "undefined" &&
    typeof (entity as ParentTrait).getChildren !== "undefined"
  )
}

export interface ParentTrait {
  hijacksInteractionTarget: boolean
  childAdded: ChildAddedHandler
  childRemoved: ChildRemovedHandler

  addChild: (entity: ChildTrait, arg1?: boolean | number) => void
  countChildren(): number
  getChildren<T extends ChildTrait>(): T[]
  getChild<T extends ChildTrait>(idx: number): T
  getTop<T extends ChildTrait>(): T
  getBottom<T extends ChildTrait>(): T
  isIndexOutOfBounds(index: number): boolean
  moveChildTo(from: number, to: number)
  removeChild(child: ChildTrait): boolean
  removeChildAt(idx: number): boolean
  query<T extends ChildTrait>(props: QuerableProps): T
  queryAll<T extends ChildTrait>(props: QuerableProps): T[]
}

/**
 * Find one item matching props.
 * @param props
 */
export function query<T extends ChildTrait>(
  this: ParentTrait,
  props: QuerableProps
): T {
  // Grab all current children
  const children = this.getChildren()

  // Check if maybe some of them match the query
  const firstLevel = children.find(queryRunner(props))

  if (firstLevel) {
    return firstLevel as ChildTrait & T
  }

  // Keep querying for the same props in children if they're also parents

  for (const entity of children) {
    if (!isParent(entity)) continue

    const result = entity.query(props)
    if (result) {
      return result as ChildTrait & T
    }
  }
}

/**
 * Looks for every matching entity here and deeper
 */
export function queryAll<T extends ChildTrait>(
  this: ParentTrait,
  props: QuerableProps
): T[] {
  const result: (ChildTrait & T)[] = []

  // Grab all current children
  const children = this.getChildren<T>()

  // Check if maybe some of them match the query
  result.push(...children.filter(queryRunner<T>(props)))

  // Keep querying for the same props in children if they're also parents
  for (const entity of children) {
    if (!isParent(entity)) continue

    result.push(...entity.queryAll<T>(props))
  }

  return result
}

export const hasChildren = (entity) =>
  isParent(entity) ? entity.countChildren() > 0 : false

export const getKnownConstructor = (entity: ChildTrait) =>
  registeredChildren.find((con) => entity instanceof con)

export const pickByIdx = (idx: number) => (child: ChildTrait) =>
  child.idx === idx
export const sortByIdx = (a: ChildTrait, b: ChildTrait) => a.idx - b.idx

export type ChildAddedHandler = (child: ChildTrait) => void
export type ChildRemovedHandler = (idx: number) => void
