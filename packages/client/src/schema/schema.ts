import type { ObjectSchema } from "./types"

/**
 * Is given object a schema of entities container
 */
export function isSchemaParent(schema: ObjectSchema): boolean {
  return Object.keys(schema?._definition?.schema).some((prop) =>
    prop.startsWith("children")
  )
}
