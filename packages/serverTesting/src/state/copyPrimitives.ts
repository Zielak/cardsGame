import type { traits, State } from "@cardsgame/server"

import type {
  EntityMockingDefinition,
  InitialStateDescription,
} from "../types.js"

function copyPrimitives(target, preparation): void {
  // Copy primitive values
  Object.keys(preparation)
    .filter(
      (key) =>
        typeof target[key] !== "object" && typeof target[key] !== "function"
    )
    .forEach((key) => {
      target[key] = preparation[key]
    })
}

/**
 * Copies every primitive value from `preparation` onto the Entity
 */
export function copyEntityPrimitives(
  entity: traits.ChildTrait | traits.ParentTrait,
  preparation: EntityMockingDefinition
): void {
  copyPrimitives(entity, preparation)
}

/**
 * Copies every primitive value from `preparation` onto the State
 */
export function copyStatePrimitives<S extends State>(
  state: S,
  statePreparation: InitialStateDescription<S>
): void {
  copyPrimitives(state, statePreparation)
}
