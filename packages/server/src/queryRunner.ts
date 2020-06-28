import {
  ClassicCard,
  Container,
  Deck,
  Grid,
  Hand,
  Line,
  Pile,
  Spread,
} from "./entities"
import { ChildTrait, isChild } from "./traits/child"
import { hasIdentity } from "./traits/identity"
import { hasOwnership } from "./traits/ownership"
import { isParent } from "./traits/parent"
import { hasSelectableChildren } from "./traits/selectableChildren"

type EveryEntity = ClassicCard &
  Container &
  Deck &
  Grid &
  Hand &
  Line &
  Pile &
  Spread

type KeysToIgnore =
  | "$changed"
  | "childrenPointers"
  | "hijacksInteractionTarget"
  | "id"
  | "idxPath"
  | "parent"
  | "selectedChildren"

export type EntityOptions = Partial<
  AllowArrays<Omit<NonFunctionProperties<EveryEntity>, KeysToIgnore>>
>

export interface QuerableProps extends EntityOptions {
  parent?: QuerableProps
  selected?: boolean
  selectionIndex?: number | number[]
}

export const queryRunner = <T>(props: QuerableProps) => (
  entity: T
): boolean => {
  if (!isChild(entity)) return false

  return Object.keys(props).every((propName) => {
    if (Array.isArray(props[propName])) {
      return props[propName].some(verifyValue(propName, entity))
    } else {
      return verifyValue(propName, entity)(props[propName])
    }
  })
}

function verifyValue(propName: string, entity: ChildTrait) {
  return function verifyValueIteration(value: any): boolean {
    if (propName === "parent") {
      // Current Entity ust have an identity AND be a child
      if (!hasIdentity(entity.parent)) return false
      if (!isChild(entity.parent)) return false
      // It's in root state...
      if (entity.parent.id === -1) return false

      // If provided "parent" is direct reference to other entity
      if (isParent(value)) {
        return value === entity.parent
      }

      // Else, it's probably another set of QuerableProps
      return queryRunner(value)(entity.parent)
    } else if (propName === "owner") {
      if (!hasOwnership(entity)) return false

      return entity.owner === value
    } else if (propName === "selected") {
      const parent = entity.parent
      if (!hasSelectableChildren(parent)) return false

      return value === parent.isChildSelected(entity.idx)
    } else if (propName === "selectionIndex") {
      const parent = entity.parent
      if (!hasSelectableChildren(parent)) return false

      return value === parent.getSelectionIndex(entity.idx)
    } else {
      return entity[propName] === value
    }
  }
}
