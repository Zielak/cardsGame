import type { EntityMockingDefinition } from "./types"

/**
 * Creates `EntityMockingDefinition` object containing `children` with objects
 * containing names.
 *
 * @param names can be single name, will be wrapped in an array anyway
 */
export function childrenNamed(
  names: string[] | string
): EntityMockingDefinition {
  return {
    children: objectsNamed(Array.isArray(names) ? names : [names]),
  }
}

/**
 * Turns an array of strings into array of objects with `name`.
 *
 * Useful in creating `children` prop in `EntityMockingDefinition`.
 *
 * @param names can be single name, will be wrapped in an array anyway
 */
export function objectsNamed(
  names: string[] | string
): Array<EntityMockingDefinition> {
  return (Array.isArray(names) ? names : [names]).map((name) => ({ name }))
}
