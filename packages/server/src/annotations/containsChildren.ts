import { logs } from "@cardsgame/utils"

import type { Entity } from "../traits/entity"

import { synchChildrenArray } from "./annotations"
import { globalEntitiesContext } from "./entitiesContext"

/**
 * Class Decorator!
 * Remember as possible parent to any kinds of children entities
 * Also enables syncing any previously remembered children kind on this constructor
 * @param childrenSynced set `false` to keep list of children secret from clients
 */
export function containsChildren(childrenSynced = true) {
  return function containsChildrenDec(parentConstructor: typeof Entity): void {
    logs.verbose("containsChildren", parentConstructor.name)

    const context = globalEntitiesContext

    // Remember this parent
    context.registeredParents.push({
      con: parentConstructor,
      childrenSynced,
    })

    Object.defineProperty(parentConstructor.prototype, "__syncChildren", {
      value: childrenSynced,
    })

    // Add all known children kinds to this one
    if (childrenSynced) {
      const job = (childConstructor): void =>
        synchChildrenArray(parentConstructor, childConstructor)

      context.registeredChildren.forEach(job)
      if (context !== globalEntitiesContext) {
        globalEntitiesContext.registeredChildren.forEach(job)
      }
    }
  }
}
