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
  if (!isChild(entity)) {
    return false
  }

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
    const { parent } = entity

    switch (propName) {
      case "parent":
        // Current Entity ust have an identity AND be a child
        if (!hasIdentity(parent)) {
          return false
        }
        if (!isChild(parent)) {
          return false
        }
        // It's in root state...
        if (parent.id === -1) {
          return false
        }

        // If provided "parent" is direct reference to other entity
        if (isParent(value)) {
          return value === parent
        }

        // Else, it's probably another set of QuerableProps
        return queryRunner(value)(parent)

      case "owner":
        if (!hasOwnership(entity)) {
          return false
        }
        return entity.owner === value

      case "selected":
        if (!hasSelectableChildren(parent)) {
          return false
        }
        return value === parent.isChildSelected(entity.idx)

      case "selectionIndex":
        if (!hasSelectableChildren(parent)) {
          return false
        }
        return value === parent.getSelectionIndex(entity.idx)

      default:
        return entity[propName] === value
    }
  }
}
