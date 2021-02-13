import { DataChange } from "@colyseus/schema/lib/Schema"

export type CollectionCallbacks = (
  instance: Schema,
  key: string | number
) => void
export type SchemaChangeCallback = (changes: DataChange[]) => void

export interface ObjectSchema {
  [key: string]: any
  onChange: SchemaChangeCallback
}

export interface ObjectsCollectionSchema {
  [key: string]: any
  onAdd: CollectionCallbacks
  onRemove: CollectionCallbacks
}

export interface PrimitivesCollectionSchema {
  [key: string]: any
  onChange: CollectionCallbacks
}

export type Schema =
  | ObjectSchema
  | ObjectsCollectionSchema
  | PrimitivesCollectionSchema

export type State = {
  [key: string]: Schema
} & {
  [prop in "onChange"]: SchemaChangeCallback
}
