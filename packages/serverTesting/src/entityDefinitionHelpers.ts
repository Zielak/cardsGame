import type { EntityMockingDefinition } from "./types.js"

/**
 * Creates [`EntityMockingDefinition`](#entitymockingdefinition) object
 * containing `children` with objects containing names.
 *
 * @param names can be single name, will be wrapped in an array anyway
 *
 * @example given multiple names
 * ```ts
 * childrenNamed(["D7", "D8", "D9"])
 * // returns:
 * {
 *   children: [
 *     { name: "D7"}, { name: "D8"}, { name: "D9"}
 *   ]
 * }
 * ```
 * @example single string param
 * ```ts
 * childrenNamed("D7")
 * // returns:
 * {
 *   children: [{ name: "D7"}]
 * }
 * ```
 *
 * @category Utility
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
 * Useful in creating `children` prop in [`EntityMockingDefinition`](#entitymockingdefinition).
 *
 * @param names can be single name, will be wrapped in an array anyway
 *
 * @example given multiple names
 * ```ts
 * objectsNamed(["D7", "D8", "D9"])
 * // returns:
 * [{ name: "D7"}, { name: "D8"}, { name: "D9"}]
 * ```
 * @example single string param
 * ```ts
 * objectsNamed("D7")
 * // returns:
 * [{ name: "D7"}]
 * ```
 *
 * @category Utility
 */
export function objectsNamed(
  names: string[] | string
): Array<EntityMockingDefinition> {
  return (Array.isArray(names) ? names : [names]).map((name) => ({ name }))
}
