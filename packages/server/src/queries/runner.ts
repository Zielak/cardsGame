import {
  ChildTrait,
  isChild,
  hasIdentity,
  hasOwnership,
  isParent,
  hasSelectableChildren,
} from "../traits/index.js"

import type { QuerableProps } from "./types.js"

/**
 * @ignore
 */
export const queryRunner =
  <T>(props: QuerableProps) =>
  (entity: T): boolean => {
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
