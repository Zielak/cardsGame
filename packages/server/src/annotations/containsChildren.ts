import { logs } from "@cardsgame/utils"

import type { Entity } from "../traits/entity"

import { synchChildrenArray } from "./annotations"
import { globalEntitiesContext } from "./entitiesContext"

/**
 * Class Decorator!
 * Remember given class as possible parent to any kinds of child entities
 * Also enables syncing any previously remembered children kind on this constructor
 * @category Annotation
 */
export function containsChildren(parentConstructor: typeof Entity): void {
  logs.debug("containsChildren", parentConstructor.name)

  const context = globalEntitiesContext

  // Remember this parent
  context.registeredParents.push(parentConstructor)

  // Add all known children kinds to this one
  const job = (childConstructor): void =>
    synchChildrenArray(parentConstructor, childConstructor)

  context.registeredChildren.forEach(job)
  if (context !== globalEntitiesContext) {
    globalEntitiesContext.registeredChildren.forEach(job)
  }
}
