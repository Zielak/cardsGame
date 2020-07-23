import { def } from "@cardsgame/utils"

import { canBeChild } from "../annotations/canBeChild"
import { containsChildren } from "../annotations/containsChildren"
import { State } from "../state/state"
import { ChildTrait } from "../traits/child"
import { applyTraitsMixins, Entity } from "../traits/entity"
import { IdentityTrait } from "../traits/identity"
import { LabelTrait } from "../traits/label"
import { LocationTrait } from "../traits/location"
import { OwnershipTrait } from "../traits/ownership"
import { ParentArrayTrait } from "../traits/parentArray"
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

  create(state: State, options: HandOptions = {}): void {
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
  NonFunctionProperties<Mixin> & {
    autoSort: SortingFunction
  }
>

export interface Hand extends Mixin {}
