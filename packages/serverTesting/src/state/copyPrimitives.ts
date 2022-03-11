import type { ChildTrait, ParentTrait } from "@cardsgame/server"

import type { EntityMockingDefinition } from "../types"

/**
 * Copies every primitive value from `preparation` onto the Entity
 */
export function copyPrimitives(
  entity: ChildTrait | ParentTrait,
  preparation: EntityMockingDefinition
): void {
  // Copy primitive values
  Object.keys(preparation)
    .filter(
      (key) =>
        typeof entity[key] !== "object" && typeof entity[key] !== "function"
    )
    .forEach((key) => {
      entity[key] = preparation[key]
    })
}
