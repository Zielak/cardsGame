import { globalEntitiesContext } from "../annotations/entitiesContext"
import { QuerableProps } from "../queryRunner"
import { ChildTrait } from "./child"

export function isParent(entity: any): entity is ParentTrait {
  return (
    typeof entity == "object" &&
    typeof (entity as ParentTrait).query !== "undefined" &&
    typeof (entity as ParentTrait).getChildren !== "undefined"
  )
}

export interface ParentTrait {
  /**
   * @memberof ParentTrait
   */
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

export const hasChildren = (entity): boolean =>
  isParent(entity) ? entity.countChildren() > 0 : false

export const getKnownConstructor = (entity: ChildTrait): Function =>
  globalEntitiesContext.registeredChildren.find((con) => entity instanceof con)

/**
 * Finding function, for `find()` iteration
 */
export const pickByIdx = (idx: number) => (child: ChildTrait): boolean =>
  child.idx === idx

/**
 * Sorting function, for `sort()`
 */
export const sortByIdx = (a: ChildTrait, b: ChildTrait): number => a.idx - b.idx

export type ChildAddedHandler = (child: ChildTrait) => void
export type ChildRemovedHandler = (idx: number) => void
