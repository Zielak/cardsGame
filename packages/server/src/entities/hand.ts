import { containsChildren, canBeChild, ParentTrait } from "../traits/parent"
import { def } from "@cardsgame/utils"
import { LocationTrait } from "../traits/location"
import { ChildTrait } from "../traits/child"
import { LabelTrait, Entity, applyMixins, OwnershipTrait } from "../traits"
import { State } from "../state"

@canBeChild
@containsChildren()
export class Hand extends Entity<HandOptions> {
  autoSort: SortingFunction

  constructor(state: State, options: HandOptions = {}) {
    super(state, options)

    this.name = def(options.name, "Hand")
    this.type = def(options.type, "hand")

    this.autoSort = options.autoSort
  }

  childAdded(child: ChildTrait) {
    if (!this.autoSort) return
    const count = this.countChildren()
    for (let idx = 0; idx < count; idx++) {
      if (this.autoSort(child, this.getChild(idx)) > 0) {
        continue
      }
      // I shall drop incomming child right here
      this.moveChildTo(child.idx, idx)
      break
    }
  }
}

interface Mixin
  extends LocationTrait,
    ChildTrait,
    ParentTrait,
    LabelTrait,
    OwnershipTrait {}

type HandOptions = Partial<
  ConstructorType<Mixin> & {
    autoSort: SortingFunction
  }
>

export interface Hand extends Mixin {}

applyMixins(Hand, [
  LocationTrait,
  ChildTrait,
  ParentTrait,
  LabelTrait,
  OwnershipTrait
])

type SortingFunction = (childA: ChildTrait, childB: ChildTrait) => number
