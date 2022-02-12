import type { DataChange } from "@colyseus/schema/lib/Schema"

export type PrimitiveValue = string | boolean | number

export type SchemaDefinitionValue =
  | string
  | ArraySchemaDefinition
  | MapSchemaDefinition
  | WithSchemaDefinition // Just another schema object inside
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
export type MapSchemaDefinition =
  | MapOfPrimitivesDefinition
  | MapOfSchemaObjectsDefinition

type ArrayOfPrimitivesDefinition = Record<"array", string>
type ArrayOfSchemaObjectsDefinition = Record<"array", WithSchemaDefinition>
export type ArraySchemaDefinition =
  | ArrayOfPrimitivesDefinition
  | ArrayOfSchemaObjectsDefinition

type CollectionOfPrimitivesDefinition =
  | MapOfPrimitivesDefinition
  | ArrayOfPrimitivesDefinition
type CollectionOfObjectsDefinition =
  | MapOfSchemaObjectsDefinition
  | ArrayOfSchemaObjectsDefinition

type CollectionCallback<T, K> = (instance: T, key: K) => void

export type SchemaChangeCallback = (changes: DataChange[]) => void

export interface ObjectSchema<T = Record<string, any>>
  extends WithSchemaDefinition {
  onChange: SchemaChangeCallback
  listen<K extends keyof T>(
    propName: K,
    callback: (value: T[K], previousValue: T[K]) => void
  ): () => void
}

/**
 * Client-side, could also be wrapped with array-like or map-like functions.
 */
export interface ObjectsCollectionSchema<T = any, K = string>
  extends WithSchemaDefinition {
  [key: string]: any
  onAdd: CollectionCallback<T & Schema, K>
  onRemove: CollectionCallback<T & Schema, K>
}

/**
 * Client-side, could also be wrapped with array-like or map-like functions.
 */
export interface PrimitivesCollectionSchema<T = PrimitiveValue, K = string>
  extends WithSchemaDefinition {
  [key: string]: any
  onAdd: CollectionCallback<T, K>
  onRemove: CollectionCallback<T, K>
  onChange: CollectionCallback<T, K>
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
export type ClientGameStateProps = {
  clients: string[]

  currentPlayerIdx?: number
  isGameStarted: boolean
  isGameOver: boolean

  playerViewPosition: /*ObjectSchema &*/ IPlayerViewPosition
  players: IPlayerDefinition[]

  tableHeight: number
  tableWidth: number

  turnBased: boolean
  round: number

  ui?: Map<string, string>
}
export type ClientGameState<MoreProps = Record<string, any>> =
  ClientGameStateProps &
    MoreProps &
    ObjectSchema<ClientGameStateProps & MoreProps>

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

export function isDefinitionOfPrimitive(o: unknown): o is string {
  return typeof o === "string"
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
