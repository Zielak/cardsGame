import { DataChange } from "@colyseus/schema/lib/Schema"

export type SchemaDefinitionFieldTypes = Record<string, SchemaDefinitionValue>
interface SchemaDefinition {
  schema: SchemaDefinitionFieldTypes
}

export interface WithSchemaDefinition {
  _definition: SchemaDefinition
}

// This is fun
type MapOfPrimitivesDefinition = Record<"map", string>
type MapOfSchemaObjectsDefinition = Record<"map", WithSchemaDefinition>
type MapSchemaDefinition = MapOfPrimitivesDefinition &
  MapOfSchemaObjectsDefinition

type ArrayOfPrimitivesDefinition = Record<"array", string>
type ArrayOfSchemaObjectsDefinition = Record<"array", WithSchemaDefinition>
type ArraySchemaDefinition = ArrayOfPrimitivesDefinition &
  ArrayOfSchemaObjectsDefinition

type CollectionOfPrimitivesDefinition = MapOfPrimitivesDefinition &
  ArrayOfPrimitivesDefinition
type CollectionOfObjectsDefinition = MapOfSchemaObjectsDefinition &
  ArrayOfSchemaObjectsDefinition

export type SchemaDefinitionValue =
  | string
  | ArraySchemaDefinition
  | MapSchemaDefinition
  | WithSchemaDefinition // Just another schema object inside

export type CollectionCallbacks<T = any> = (
  instance: T & Schema,
  key: string | number
) => void
export type PrimitiveCollectionCallbacks<T = any> = (
  instance: T,
  key: string | number
) => void

export type SchemaChangeCallback = (changes: DataChange[]) => void

export interface ObjectSchema<T = Record<string, any>>
  extends WithSchemaDefinition {
  [key: string]: any
  onChange: SchemaChangeCallback
  listen<K extends keyof T>(
    propName: K,
    callback: (value: T[K], previousValue: T[K]) => void
  ): () => void
}

export interface ObjectsCollectionSchema<T = any>
  extends Array<T>,
    WithSchemaDefinition {
  [key: string]: any
  onAdd: CollectionCallbacks<T>
  onRemove: CollectionCallbacks<T>
}

export interface PrimitivesCollectionSchema<T = any>
  extends Array<T>,
    WithSchemaDefinition {
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
export type ClientGameState = {
  [key: string]: Schema | number | string | boolean

  clients: PrimitivesCollectionSchema<string>

  currentPlayerIdx?: number
  isGameStarted: boolean
  isGameOver: boolean

  playerViewPosition: ObjectSchema & IPlayerViewPosition
  players: ObjectsCollectionSchema<IPlayerDefinition>

  tableHeight: number
  tableWidth: number

  ui?: ObjectSchema & { [key: string]: string }
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

export function isDefinitionOfPrimitivesCollection(
  o: unknown
): o is CollectionOfPrimitivesDefinition {
  if (isDefinitionOfMapSchema(o)) {
    return typeof o.map === "string"
  } else if (isDefinitionOfArraySchema(o)) {
    return typeof o.array === "string"
  }
  return false
}

export function isDefinitionOfObjectsCollection(
  o: unknown
): o is CollectionOfObjectsDefinition {
  if (isDefinitionOfMapSchema(o)) {
    return isDefinitionOfSchema(o.map)
  } else if (isDefinitionOfArraySchema(o)) {
    return isDefinitionOfSchema(o.array)
  }
  return false
}
