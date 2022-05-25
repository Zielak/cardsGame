import { def } from "@cardsgame/utils"

import { canBeChild } from "../annotations/canBeChild"
import { containsChildren } from "../annotations/containsChildren"
import type { State } from "../state"
import { ChildTrait } from "../traits/child"
import { applyTraitsMixins, Entity } from "../traits/entity"
import { IdentityTrait } from "../traits/identity"
import { LabelTrait } from "../traits/label"
import { LocationTrait } from "../traits/location"
import { OwnershipTrait } from "../traits/ownership"
import { ParentTrait } from "../traits/parent"
import { SelectableChildrenTrait } from "../traits/selectableChildren"

import { SortingFunction, sortOnChildAdded } from "./utils/sorting"

/**
 * @category Entity
 */
@canBeChild
@containsChildren()
@applyTraitsMixins([
  IdentityTrait,
  LocationTrait,
  ChildTrait,
  ParentTrait,
  LabelTrait,
  OwnershipTrait,
  SelectableChildrenTrait,
])
export class Hand extends Entity<HandOptions> {
  autoSort: SortingFunction

  create(state: State, options: HandOptions = {}): void {
    this.name = def(options.name, "Hand")
    this.type = def(options.type, "hand")

    this.hijacksInteractionTarget = def(options.hijacksInteractionTarget, false)

    this.autoSort = options.autoSort
  }

  childAdded = sortOnChildAdded
}

interface Mixin
  extends IdentityTrait,
    LocationTrait,
    ChildTrait,
    ParentTrait,
    LabelTrait,
    OwnershipTrait,
    SelectableChildrenTrait {}

type HandOptions = Partial<
  NonFunctionProperties<Mixin> & {
    autoSort: SortingFunction
  }
>

export interface Hand extends Mixin {}
