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
import { LabelTrait, Entity, applyMixins } from "../traits"
import { State } from "../state"

@canBeChild
@containsChildren()
export class Hand extends Entity<HandOptions> {
  autoSort: SortingFunction

  constructor(state: State, options: Partial<Hand> = {}) {
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

interface HandOptions
  extends LocationTrait,
    ChildTrait,
    ParentTrait,
    LabelTrait {
  autoSort: SortingFunction
}

export interface Hand extends HandOptions {}

applyMixins(Hand, [LocationTrait, ChildTrait, ParentTrait, LabelTrait])

type SortingFunction = (childA: ChildTrait, childB: ChildTrait) => number
