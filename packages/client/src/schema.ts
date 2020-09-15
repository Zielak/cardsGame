import { DataChange } from "@colyseus/schema/lib/Schema"

type CollectionCallbacks = (instance: Schema, key: string | number) => void
type SchemaChangeCallback = (changes: DataChange[]) => void

export interface ObjectChangeCallbacks {
  onChange: SchemaChangeCallback
}

export interface CollectionChangeCallbacks {
  onAdd: CollectionCallbacks
  onRemove: CollectionCallbacks
  onChange: CollectionCallbacks
}

export interface ObjectSchema extends ObjectChangeCallbacks {
  [key: string]: any
}

export interface CollectionSchema extends CollectionChangeCallbacks {
  [key: string]: any
}

export type Schema = ObjectSchema | CollectionSchema

export type State = {
  [key: string]: Schema
} & {
  [prop in "onChange"]: SchemaChangeCallback
}
