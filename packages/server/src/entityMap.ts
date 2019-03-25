import { nosync } from "colyseus"
import { Entity } from "./entity"
import { EntityEvents } from "@cardsgame/utils"
import { logs } from "./logs"

export class EntityMap<T> {
  [entityID: number]: T | any

  @nosync
  add(entity: T): number {
    const idx = this.length
    this[idx] = entity
    return idx
    // notifyNewIdx(entity, idx)
  }

  remove(idx: number)
  remove(idx: string)
  @nosync
  remove(_idx: number | string) {
    const idx = typeof _idx === "number" ? _idx : parseInt(_idx)
    if (typeof this[idx] === "undefined") {
      return false
    }

    notifyNewIdx(this[idx], undefined)
    delete this[idx]
    this.updateOrder()
    return true
  }

  /**
   * Makes sure that every child is at its own
   * unique 'idx' value, starting with 0
   */
  @nosync
  updateOrder() {
    const keys = Object.keys(this)
    keys.forEach((_key, idx) => {
      const key = parseInt(_key)
      if (key === idx) return

      // We've got empty space right here
      if (this[idx] === undefined) {
        this[idx] = this[key]
        delete this[key]
        notifyNewIdx(this[idx], idx)
      } else {
        this[idx] = this[key]
        notifyNewIdx(this[idx], idx)
        throw new Error(`I don't know how that happened to be honest`)
      }
    })
    return this
  }

  @nosync
  toArray(): T[] {
    return Object.keys(this).map(idx => this[idx])
  }

  @nosync
  get length(): number {
    return Object.keys(this).length
  }

  static byName = (name: string) => (entity: Entity): boolean =>
    entity.name === name

  static byType = (type: string) => (entity: Entity): boolean =>
    entity.type === type

  static sortByIdx = (a: Entity, b: Entity): number => a.idx - b.idx
}

export const notifyNewIdx = (entity: any, idx: number) => {
  if (entity instanceof Entity) {
    const e = entity as Entity
    logs.verbose(
      "notifyNewIdx",
      e.type + ":" + e.name,
      `[${entity.idx} => ${idx}]`
    )
    e.emit(EntityEvents.idxUpdate, idx)
  }
}
