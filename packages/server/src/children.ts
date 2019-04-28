import { Schema, type, ArraySchema } from "@colyseus/schema"
import chalk from "chalk"
import { logs } from "./logs"
import { IEntity } from "./entities/traits/entity"
import { byIdx, IParent } from "./entities/traits/parent"

import { ClassicCard } from "./entities/classicCard"
import { Deck } from "./entities/deck"
import { Hand } from "./entities/hand"
import { Pile } from "./entities/pile"
import { Player } from "./player"

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

  // Game objects
  @type([ClassicCard])
  classicCards = new ArraySchema<ClassicCard>()

  // Containers
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

  /**
   * Adds new children to this container
   * @param child entity or container
   * @param idx target index, last by default
   */
  add(child: IEntity | IParent, idx?: number): Children {
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
  /**
   * Remove a child from this collection
   */
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

  moveTo(from: number, to: number): Children {
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

    return this
  }

  /**
   * Get's nth child of this collection
   * @param idx
   */
  get<T extends IEntity>(idx: number): T {
    return this[this.pointers[idx]]
  }

  toArray<T extends IEntity>(): T[] {
    return this.arrays
      .reduce((prev: T[], def) => {
        return prev.concat(...def.array)
      }, [])
      .sort(byIdx)
  }

  // find = Object.assign(
  //   <T extends IEntity>(
  //     predicate: (child: T, idx: number, array: T[]) => boolean
  //   ): T => {
  //     return (this.toArray() as T[]).find(predicate)
  //   },
  //   query.find
  // )

  // filter = Object.assign(
  //   <T extends IEntity>(
  //     predicate: (child: T, idx: number, array: T[]) => boolean
  //   ): T[] => {
  //     return (this.toArray() as T[]).filter(predicate)
  //   },
  //   query.filter
  // )

  getContainers(deep = true): IParent[] {
    return this.toArray<IParent>().reduce((prev, current) => {
      if (current._children) {
        prev.push(current)
        if (deep) {
          prev.push(current._children.getContainers())
        }
        return prev
      }
    }, [])
  }

  /**
   * Recursively fetches all children
   */
  getDescendants<T extends IEntity>(): T[] {
    return this.toArray<T>().reduce((prev, current) => {
      prev.push(current)
      if (current["_children"]) {
        prev.concat(
          ((current as unknown) as IParent)._children.getDescendants()
        )
      }
      return prev
    }, [])
  }

  /**
   * Count all children in this collection
   */
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

  findAll<T extends IEntity>(
    props: QuerableProps,
    options?: QueryOptions
  ): T[] {
    const result = (options.deep
      ? this.getDescendants<T>()
      : this.toArray<T>()
    ).filter(queryRunner(props))
    if (result.length === 0) {
      throw new Error(
        `findAll: couldn't find anything.\nQuery: ${JSON.stringify(props)}`
      )
    }
    return result
  }

  find<T extends IEntity>(props: QuerableProps, options?: QueryOptions): T {
    const result = (options.deep
      ? this.getDescendants<T>()
      : this.toArray<T>()
    ).find(queryRunner(props))
    if (!result) {
      throw new Error(
        `find: couldn't find anything.\nQuery: ${JSON.stringify(props)}`
      )
    }
    return result
  }
}

const queryRunner = (props: QuerableProps) => (entity: IEntity) => {
  const propKeys = Object.keys(props)

  return propKeys.every(propName => {
    return entity[propName] === props[propName]
  })
}

interface QueryOptions {
  deep: boolean
  one: boolean
}

interface QuerableProps {
  id?: EntityID

  idx?: number
  parent?: EntityID | QuerableProps
  owner?: Player

  type?: string
  name?: string

  [key: string]: any
}
