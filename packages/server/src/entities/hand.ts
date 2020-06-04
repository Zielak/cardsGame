import { def } from "@cardsgame/utils"

import { canBeChild, containsChildren } from "../annotations"
import { State } from "../state/state"
import { ParentArrayTrait } from "../traits/parentArray"
import { LocationTrait } from "../traits/location"
import { ChildTrait } from "../traits/child"
import { Entity, applyTraitsMixins } from "../traits/entity"
import { LabelTrait } from "../traits/label"
import { OwnershipTrait } from "../traits/ownership"
import { IdentityTrait } from "../traits/identity"
import { SelectableChildrenTrait } from "../traits/selectableChildren"
import { SortingFunction, sortOnChildAdded } from "./utils/sorting"

@canBeChild
@containsChildren()
@applyTraitsMixins([
  IdentityTrait,
  LocationTrait,
  ChildTrait,
  ParentArrayTrait,
  LabelTrait,
  OwnershipTrait,
  SelectableChildrenTrait,
])
export class Hand extends Entity<HandOptions> {
  autoSort: SortingFunction

  hijacksInteractionTarget = false

  create(state: State, options: HandOptions = {}) {
    this.name = def(options.name, "Hand")
    this.type = def(options.type, "hand")

    this.autoSort = options.autoSort
  }

  childAdded = sortOnChildAdded
}

interface Mixin
  extends IdentityTrait,
    LocationTrait,
    ChildTrait,
    ParentArrayTrait,
    LabelTrait,
    OwnershipTrait,
    SelectableChildrenTrait {}

type HandOptions = Partial<
  ConstructorType<Mixin> & {
    autoSort: SortingFunction
  }
>

export interface Hand extends Mixin {}
