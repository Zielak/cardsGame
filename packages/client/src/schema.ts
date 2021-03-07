import { DataChange } from "@colyseus/schema/lib/Schema"

export type SchemaDefinitionFieldTypes = Record<string, SchemaDefinitionValue>
interface SchemaDefinition {
  schema: SchemaDefinitionFieldTypes
}

export interface WithSchemaDefinition {
  _definition: SchemaDefinition
}
type MapSchemaDefinition = Record<"map", string | WithSchemaDefinition>
type ArraySchemaDefinition = Record<"array", string | WithSchemaDefinition>

export type SchemaDefinitionValue =
  | string
  | ArraySchemaDefinition
  | MapSchemaDefinition
  | WithSchemaDefinition // Just another schema object inside

export type CollectionCallbacks = (
  instance: Schema,
  key: string | number
) => void
export type PrimitiveCollectionCallbacks<T = any> = (
  instance: T,
  key: string | number
) => void

export type SchemaChangeCallback = (changes: DataChange[]) => void

export interface ObjectSchema extends WithSchemaDefinition {
  [key: string]: any
  onChange: SchemaChangeCallback
}

export interface ObjectsCollectionSchema extends WithSchemaDefinition {
  [key: string]: any
  onAdd: CollectionCallbacks
  onRemove: CollectionCallbacks
}

export interface PrimitivesCollectionSchema<T = any>
  extends WithSchemaDefinition {
  [key: string]: any
  onAdd: PrimitiveCollectionCallbacks<T>
  onRemove: PrimitiveCollectionCallbacks<T>
  onChange: PrimitiveCollectionCallbacks<T>
}

/**
 * Base for all fields in State in each schema.
 */
export type Schema =
  | ObjectSchema
  | ObjectsCollectionSchema
  | PrimitivesCollectionSchema

/**
 * Root game state
 */
export type State = {
  [key: string]: Schema
} & {
  [prop in "onChange"]: SchemaChangeCallback
} &
  WithSchemaDefinition

export function isSchemaObject(o: unknown): o is Schema {
  return (
    typeof o === "object" &&
    "$changes" in o &&
    "_definition" in o &&
    isSchemaDefinition(o["_definition"])
  )
}

export function isSchemaDefinition(o: unknown): o is SchemaDefinition {
  return (
    typeof o === "object" &&
    "schema" in o &&
    typeof o["schema"] === "object" &&
    !("$changes" in o["schema"]) &&
    !("_definition" in o["schema"])
  )
}

export function isDefinitionOfSchema(o: unknown): o is WithSchemaDefinition {
  return typeof o === "function" && "_definition" in o && !("$changes" in o)
}

export function isDefinitionOfMapSchema(o: unknown): o is MapSchemaDefinition {
  return typeof o === "object" && o !== null && "map" in o
}

export function isDefinitionOfArraySchema(
  o: unknown
): o is ArraySchemaDefinition {
  return typeof o === "object" && o !== null && "array" in o
}
