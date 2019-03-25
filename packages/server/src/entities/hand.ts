import Bezier from "bezier-js"
import { Container } from "./container"
import { Entity, IEntityOptions } from "../entity"
import { EntityEvents } from "@cardsgame/utils"
import { logs } from "../logs"
import { State } from "../state"

export class Hand extends Container {
  type = "hand"
  autoSort: SortingFunction

  constructor(options?: IHandOptions) {
    super(options)

    if (options.autoSort) {
      this.autoSort = options.autoSort
      this.on(EntityEvents.childAdded, (childA: Entity) => {
        const count = this.children.length - 1
        logs.info(`Hand.autoSort`, `0..${count}`)
        for (let idx = 0; idx < count; idx++) {
          if (this.autoSort(childA, this.children[idx]) > 0) {
            continue
          }
          // this._state.logTreeState(this)
          // I shall drop incomming child right here
          logs.info(`Hand.autoSort`, `children.moveTo(${childA.idx}, ${idx})`)
          this.children.moveTo(childA.idx, idx)

          logs.info(`Hand.autoSort`, `AFTER:`)
          this._state.logTreeState(this)
          break
        }

        // logs.info(
        //   `Hand.autoSort`,
        //   `privatePropsSyncRequest, owner:`,
        //   this.owner
        // )
        // this.emit(State.events.privatePropsSyncRequest, this.owner)
        logs.verbose(`-------------------------------------------------`)
      })
      // No need to sort again when child gets removed
      // this.on(EntityEvents.childRemoved, (childID: EntityID) => {})
    }
  }

  restyleChild(child: Entity, idx: number, arr) {
    const max = arr.length
    const maxSpread = 8

    const outerX = maxSpread + max / 3
    const addY = max > maxSpread ? -(maxSpread - max) / 5 : 0

    //    [1]----[2]
    //    /       \
    //   /         \
    // [0]        [3]
    const b = new Bezier([
      { x: -outerX, y: 4 + addY },
      { x: -outerX + outerX / 2.5, y: -2 - addY },
      { x: outerX - outerX / 2.5, y: -2 - addY },
      { x: outerX, y: 4 + addY }
    ])

    const space = 1 / maxSpread
    let perc = idx / (max - 1)

    // Outer padding, from edge to the card
    const P = () => {
      // max
      //  1 -> 0
      var m = Math.abs(Math.min(0, max - maxSpread))
      var P = m / (maxSpread - 1) / 2
      return P
    }

    perc = max <= maxSpread ? P() + space * idx + space / 2 : perc

    const point = b.get(perc)
    const n = b.normal(perc)

    return {
      x: point.x * 10,
      y: point.y * 10,
      angle: (Math.atan2(n.y, n.x) * 180) / Math.PI + 270
    }
  }
}

interface IHandOptions extends IEntityOptions {
  autoSort?: SortingFunction
}

type SortingFunction = (childA: Entity, childB: Entity) => number
