import chalk from "chalk"
import { Entity } from "./entities/entity"
import { EntityEvents } from "@cardsgame/utils"
import { logs } from "./logs"
import { Schema, type, ArraySchema } from "@colyseus/schema"

// type EntityMapArrayNames =
//   | "entities"
//   | "baseCards"
//   | "classicCards"
//   | "containers"
//   | "decks"
//   | "hands"
//   | "piles"
//   | "rows"

export class EntityMap extends Schema {
  private arrays = [
    { prop: "entities", type: Entity },
    { prop: "baseCards", type: BaseCard },
    { prop: "classicCards", type: ClassicCard },
    { prop: "containers", type: Container },
    { prop: "decks", type: Deck },
    { prop: "hands", type: Hand },
    { prop: "piles", type: Pile },
    { prop: "rows", type: Row }
  ]

  // Entity
  @type([Entity])
  entities = new ArraySchema<Entity>()

  @type([BaseCard])
  baseCards = new ArraySchema<BaseCard>()

  @type([ClassicCard])
  classicCards = new ArraySchema<ClassicCard>()

  // Containers
  @type([Container])
  containers = new ArraySchema<Container>()

  @type([Deck])
  decks = new ArraySchema<Deck>()

  @type([Hand])
  hands = new ArraySchema<Hand>()

  @type([Pile])
  piles = new ArraySchema<Pile>()

  @type([Row])
  rows = new ArraySchema<Row>()

  // TODO: Fully intergrate it
  pointers: string[] = []

  add(child: any): boolean {
    const newIdx = this.length

    const result = this.arrays.some(def => {
      if (!(child instanceof def.type)) {
        return false
      }
      this[def.prop].push(child)
      child.idx = newIdx
      this.pointers.push(def.prop)
      return true
    })

    return result
  }

  remove(idx: number)
  remove(child: Entity)
  remove(childOrIdx: Entity | number): boolean {
    const idx = typeof childOrIdx === "number" ? childOrIdx : childOrIdx.idx

    const child = this[this.pointers[idx]].find(child => {
      return child.idx === idx
    })
    if (!child) return false

    this[this.pointers[idx]] = this[this.pointers[idx]].filter(
      el => el !== child
    )
    this.pointers[idx] = undefined

    this.updateChildrenIdx(idx)
  }

  moveTo(from: number, to: number) {
    const child = this.get(from)

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
        this.get(idx).idx = newIdx
      }
    } else if (from > to) {
      //  0  1  2  3  4  5  6
      // [x, x, x, x, _, x, x]
      //     TO-^     ^-FROM

      //  0   1
      // [To, Fr]
      for (let idx = from - 1; idx >= to; idx--) {
        const newIdx = idx + 1
        this.get(idx).idx = newIdx
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
    child.idx = to

    const entries = this.toArray().map(child => chalk.yellow(child.name))

    logs.verbose(`moveTo, [`, entries.join(", "), `]`)
    logs.verbose(`moveTo, done, now updatePointers()`)
    this.updatePointers()
  }

  private updateChildrenIdx(from: number = 0) {
    const max = this.length
    for (let i = from + 1; i <= max; i++) {
      const array = this[this.pointers[i]] as ArraySchema<Entity>
      const child = array.find(el => el.idx === i)
      child.idx = i - 1
    }
    this.updatePointers()
  }

  private updatePointers() {
    this.toArray().forEach(child => {
      const def = this.arrays.find(def => {
        if (!(child instanceof def.type)) {
          return false
        }
        return true
      })
      this.pointers[child.idx] = def.prop
    })
  }

  toArray<T extends Entity>(): T[] {
    return this.arrays
      .reduce((prev: T[], def) => {
        return prev.concat(...this[def.prop])
      }, [])
      .sort(EntityMap.sortByIdx)
  }

  get<T extends Entity>(idx: number): T {
    return this[this.pointers[idx]]
  }

  // Array-like methods

  find<T extends Entity>(
    predicate: (child: T, idx: number, array: T[]) => boolean
  ): T {
    return (this.toArray() as T[]).find(predicate)
  }

  get length(): number {
    return (
      this.entities.length +
      this.baseCards.length +
      this.classicCards.length +
      this.containers.length +
      this.decks.length +
      this.hands.length +
      this.piles.length +
      this.rows.length
    )
  }

  static sortByIdx = <T extends Entity>(a: T, b: T): number => a.idx - b.idx
}
