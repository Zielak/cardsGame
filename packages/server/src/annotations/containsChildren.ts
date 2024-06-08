import type { Entity } from "@/traits/entity.js"

import { synchChildrenArray } from "./annotations.js"
import { globalEntitiesContext } from "./entitiesContext.js"

/**
 * Class Decorator!
 * Remember given class as possible parent to any kinds of child entities
 * Also enables syncing any previously remembered children kind on this constructor
 *
 * @example
 * ```ts
 * @canBeChild
 * @containsChildren
 * export class Container extends Entity<ContainerOptions> {
 *   // ...
 * }
 * ```
 *
 * @category Annotation
 */
export function containsChildren(parentConstructor: typeof Entity): void {
  // logs.debug("containsChildren", parentConstructor.name)

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
