// TODO: Remove it? does it make any sense?

import { MapSchema, type, Schema } from "@colyseus/schema"

export interface IDataHolder {
  data: DataMap
}

export class DataMap extends Schema {
  @type({ map: "string" })
  stringMap = new MapSchema<string>()
  @type({ map: "number" })
  numberMap = new MapSchema<number>()
  @type({ map: "boolean" })
  booleanMap = new MapSchema<boolean>()

  get(key: string): string | number | boolean {
    if (this.stringMap[key] !== undefined) {
      return this.stringMap[key]
    }
    if (this.numberMap[key] !== undefined) {
      return this.numberMap[key]
    }
    if (this.booleanMap[key] !== undefined) {
      return this.booleanMap[key]
    }
  }

  where(key): "string" | "number" | "boolean" {
    if (this.stringMap[key] !== undefined) {
      return "string"
    }
    if (this.numberMap[key] !== undefined) {
      return "number"
    }
    if (this.booleanMap[key] !== undefined) {
      return "boolean"
    }
  }

  set(key: string, value: string | number | boolean) {
    const ERROR = where =>
      new Error(
        `Can't assign value of type ${typeof value}, [${key}] already exists as "${where}"`
      )

    const where = this.where(key)
    if (where !== undefined) {
      if (typeof value !== "string") throw ERROR(where)
      if (typeof value !== "number") throw ERROR(where)
      if (typeof value !== "boolean") throw ERROR(where)
    }

    switch (typeof value) {
      case "string":
        this.stringMap[key] = value
        break
      case "number":
        this.numberMap[key] = value
        break
      case "boolean":
        this.booleanMap[key] = value
        break
      default:
        throw new Error(
          `Can't assign "${typeof value}" to DataMap, expected only "number", "string" or "boolean".`
        )
    }
  }

  delete(key: string) {
    switch (this.where(key)) {
      case "string":
        delete this.stringMap[key]
        break
      case "number":
        delete this.numberMap[key]
        break
      case "boolean":
        delete this.booleanMap[key]
        break
    }
  }
}
