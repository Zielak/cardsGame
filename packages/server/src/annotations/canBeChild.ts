import { logs } from "@cardsgame/utils"

import { synchChildrenArray } from "./annotations"
import { globalEntitiesContext } from "./entitiesContext"

/**
 * Decorator!
 * Register an entity class as possible child for any other parent entities.
 *
 * @category Annotation
 */
export function canBeChild(childConstructor: AnyClass): void {
  // logs.debug("canBeChild", childConstructor.name)

  const context = globalEntitiesContext

  // Remember this child type for future classes
  context.registeredChildren.push(childConstructor)

  // Add this child type to ALL other parents,
  // which wish their children to be synced to client
  context.registeredParents.forEach((parentConstructor) =>
    synchChildrenArray(parentConstructor, childConstructor)
  )

  // Throw all prop types of this child to types registry
  // For now used by Deck in its "topDeck" schema
  context.registeredTypeDefinitions
    .get(childConstructor.name)
    .forEach((val, key) => {
      if (
        context.allChildrensTypes.has(key) &&
        context.allChildrensTypes.get(key) !== val
      ) {
        logs.warn(
          "canBeChild",
          `prop type "${key}" is already in, but contains different value`,
          val
        )
      }
      if (!context.allChildrensTypes.has(key)) {
        context.allChildrensTypes.set(key, val)
      }
    })
}
