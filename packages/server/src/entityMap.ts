import { nosync } from "colyseus"
import chalk from "chalk"
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

  @nosync
  moveTo(from: number, to: number) {
    const entry = this[from]
    this[from] = undefined

    // 1. pluck out the FROM
    // 2. keep moving from 3->2, to->3
    // 3. plop entry at empty TO

    if (from < to) {
      //  0  1  2  3  4  5  6
      // [x, x, _, x, x, x, x]
      //   from-^     ^-to

      //  0   1
      // [Fr, To]
      for (let idx = from + 1; idx <= to; idx++) {
        const newIdx = idx - 1
        this[newIdx] = this[idx]
        notifyNewIdx(this[newIdx], newIdx)
      }
    } else if (from > to) {
      //  0  1  2  3  4  5  6
      // [x, x, x, x, _, x, x]
      //     TO-^     ^-FROM

      //  0   1
      // [To, Fr]
      for (let idx = from - 1; idx >= to; idx--) {
        const newIdx = idx + 1
        this[newIdx] = this[idx]
        notifyNewIdx(this[newIdx], newIdx)
      }
    } else {
      logs.warn(
        `entityMap.moveTo()`,
        `you were trying to move to the same index:`,
        from,
        "=>",
        to
      )
    }
    // Plop entry to desired target place
    this[to] = entry
    // notifyNewIdx(entry, to)

    logs.verbose(`moveTo, keys:`, Object.keys(this))

    const entries = Object.keys(this).map(idx =>
      chalk.yellow(this[idx] && this[idx].name ? this[idx].name : this[idx])
    )

    logs.verbose(`moveTo, [`, entries.join(", "), `]`)
    logs.verbose(`moveTo, done, now updateOrder()`)
    this.updateOrder()
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

  /**
   * @deprecated seems to be unused
   */
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
