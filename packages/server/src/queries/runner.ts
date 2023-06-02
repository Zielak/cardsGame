import {
  ChildTrait,
  isChild,
  hasIdentity,
  hasOwnership,
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

    return Object.keys(props).every((propName: keyof QuerableProps) => {
      const expected = props[propName]

      if (typeof expected === "function") {
        return (expected as (value: any) => boolean)(entity[propName])
      } else if (Array.isArray(expected)) {
        return expected.some(verifyValue(propName, entity))
      } else {
        return verifyValue(propName, entity)(expected)
      }
    })
  }

function verifyValue(propName: keyof QuerableProps, entity: ChildTrait) {
  return function verifyValueIteration(value: unknown): boolean {
    const { parent } = entity

    switch (propName) {
      case "parent":
        // The parent must have identity AND be a child
        // (so not expecting root State also)
        if (!hasIdentity(parent) || !isChild(parent)) {
          return false
        }

        // Else, it's probably another set of QuerableProps
        return queryRunner(value)(parent)

      case "owner":
        // Only evaluate owner field on entities that have ownership trait
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
