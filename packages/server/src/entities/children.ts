import chalk from "chalk"
import { IEntity } from "./entity"
import { logs } from "../logs"
import { Schema, type, ArraySchema } from "@colyseus/schema"
import { byIdx } from "./traits/parent"
import { ClassicCard } from "./classicCard"
import { Deck } from "./deck"
import { Hand } from "./hand"
import { Pile } from "./pile"

// type EntityMapArrayNames =
//   | "entities"
//   | "baseCards"
//   | "classicCards"
//   | "containers"
//   | "decks"
//   | "hands"
//   | "piles"
//   | "rows"

type ArraysDefinition = {
  array: ArraySchema
  typeName: string
  constructor: Function
}

export class Children extends Schema {
  private arrays: ArraysDefinition[]

  @type([ClassicCard])
  classicCards = new ArraySchema<ClassicCard>()

  @type([Deck])
  decks = new ArraySchema<Deck>()

  @type([Hand])
  hands = new ArraySchema<Hand>()

  @type([Pile])
  piles = new ArraySchema<Pile>()

  // TODO: Fully intergrate it
  pointers: string[] = []

  constructor() {
    super()
    this.arrays = [
      {
        array: this.classicCards,
        typeName: "classicCards",
        constructor: ClassicCard
      },
      {
        array: this.decks,
        typeName: "decks",
        constructor: Deck
      },
      {
        array: this.hands,
        typeName: "hands",
        constructor: Hand
      },
      {
        array: this.piles,
        typeName: "piles",
        constructor: Pile
      }
    ]
  }

  add(child: any, idx?: number): Children {
    const targetDefinition = this.arrays.find(def => {
      return child instanceof def.constructor
    })
    if (!targetDefinition) {
      throw new Error(
        `Children.add(), unexpected type of new child. "child.type" = ${
          child.type
        }`
      )
    }

    // Check if it's already in
    if (targetDefinition.array.includes(child)) {
      logs.warn("Children.add()", `Child is already here`)
      return
    }

    const newIdx = this.length
    targetDefinition.array.push(child)
    child.idx = newIdx
    this.pointers.push(targetDefinition.typeName)

    // Lazy solution, is it enough?
    if (typeof idx == "number") {
      this.moveTo(newIdx, idx)
    }

    return this
  }

  remove(idx: number): boolean
  remove(child: IEntity): boolean
  remove(childOrIdx: IEntity | number): boolean {
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
    return true
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
      const array = this[this.pointers[i]] as ArraySchema<IEntity>
      const child = array.find(el => el.idx === i)
      child.idx = i - 1
    }
    this.updatePointers()
  }

  private updatePointers() {
    this.toArray().forEach(child => {
      const def = this.arrays.find(def => {
        if (!(child instanceof def.constructor)) {
          return false
        }
        return true
      })
      this.pointers[child.idx] = def.typeName
    })
  }

  toArray<T extends IEntity>(): T[] {
    return this.arrays
      .reduce((prev: T[], def) => {
        return prev.concat(...this[def.typeName])
      }, [])
      .sort(byIdx)
  }

  get<T extends IEntity>(idx: number): T {
    return this[this.pointers[idx]]
  }

  // Array-like methods

  find<T extends IEntity>(
    predicate: (child: T, idx: number, array: T[]) => boolean
  ): T {
    return (this.toArray() as T[]).find(predicate)
  }

  get length(): number {
    return (
      // this.baseCards.length +
      this.classicCards.length +
      // this.containers.length +
      this.decks.length +
      this.hands.length +
      this.piles.length
      // this.rows.length
    )
  }
}
