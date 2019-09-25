import { Schema } from "@colyseus/schema"
import {
  containsChildren,
  canBeChild,
  countChildren,
  getChild,
  moveChildTo,
  ParentTrait
} from "../traits/parent"
import { def } from "@cardsgame/utils"
import { LocationTrait } from "../traits/location"
import { ChildTrait } from "../traits/child"
import { IdentityTrait, Entity, applyMixins } from "../traits"
import { State } from "../state"

@canBeChild
@containsChildren()
export class Hand extends Entity {
  autoSort: SortingFunction

  constructor(state: State, options?: Partial<Hand>) {
    super(state, options)

    this.name = def(options.name, "Hand")
    this.type = def(options.type, "hand")

    this.autoSort = options.autoSort
  }

  childAdded(child: ChildTrait) {
    if (!this.autoSort) return
    const count = countChildren(this)
    for (let idx = 0; idx < count; idx++) {
      if (this.autoSort(child, getChild(this, idx)) > 0) {
        continue
      }
      // I shall drop incomming child right here
      moveChildTo(this, child.idx, idx)
      break
    }
  }
}

export interface Hand
  extends LocationTrait,
    ChildTrait,
    ParentTrait,
    IdentityTrait {}

applyMixins(Hand, [LocationTrait, ChildTrait, ParentTrait, IdentityTrait])

type SortingFunction = (childA: ChildTrait, childB: ChildTrait) => number
