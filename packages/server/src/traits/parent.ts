import { globalEntitiesContext } from "../annotations/entitiesContext"
import type { QuerableProps } from "../queryRunner"

import type { ChildTrait } from "./child"

export function isParent(entity: unknown): entity is ParentTrait {
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

export const hasChildren = (entity: unknown): boolean =>
  isParent(entity) ? entity.countChildren() > 0 : false

export const getKnownConstructor = (entity: ChildTrait): AnyClass =>
  globalEntitiesContext.registeredChildren.find((con) => entity instanceof con)

export type ChildAddedHandler = (child: ChildTrait) => void
export type ChildRemovedHandler = (idx: number) => void
