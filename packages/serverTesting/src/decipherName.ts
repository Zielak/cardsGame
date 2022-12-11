import type { EntityMockingDefinition } from "./types.js"

const deciphers: Record<
  string,
  (
    obj: Record<string, any>,
    def: EntityMockingDefinition
  ) => Record<string, any>
> = {
  classicCard: (obj, def) => {
    if (!("name" in def)) {
      return obj
    }
    obj.suit = def.name[0]
    obj.rank = def.name.substring(1)
    return obj
  },
}

/**
 * Populates object with props deciphered from entity's name.
 * Modifies object in place if `targetObject` was provided,
 * or creates a new one otherwise.
 */
export const decipherName = (
  entityDefinition: EntityMockingDefinition,
  targetObject?: Record<string, any>
): Record<string, any> => {
  const { type } = entityDefinition
  if (!targetObject) {
    targetObject = {}
  }

  const f = deciphers[type || "classicCard"]

  return f?.(targetObject, entityDefinition) || targetObject
}
