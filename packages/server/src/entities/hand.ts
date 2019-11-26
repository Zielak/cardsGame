import { def } from "@cardsgame/utils"

import { canBeChild, containsChildren } from "../annotations"
import { State } from "../state"
import { ParentTrait } from "../traits/parent"
import { LocationTrait } from "../traits/location"
import { ChildTrait } from "../traits/child"
import {
  LabelTrait,
  Entity,
  applyMixins,
  OwnershipTrait,
  IdentityTrait
} from "../traits"

@canBeChild
@containsChildren()
@applyMixins([
  IdentityTrait,
  LocationTrait,
  ChildTrait,
  ParentTrait,
  LabelTrait,
  OwnershipTrait
])
export class Hand extends Entity<HandOptions> {
  autoSort: SortingFunction

  create(state: State, options: HandOptions = {}) {
    this.name = def(options.name, "Hand")
    this.type = def(options.type, "hand")

    this.hijacksInteractionTarget = def(options.hijacksInteractionTarget, false)

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
  extends IdentityTrait,
    LocationTrait,
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

type SortingFunction = (childA: ChildTrait, childB: ChildTrait) => number
