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

import { SortingFunction, sortOnChildAdded } from "./utils/sorting"

/**
 * Cards placed on the table, each neatly placed at such an angle
 * to make every card's suit and rank to be visible.
 * Like Pile, but you can see every card. Meant for small count of entities.
 */
@canBeChild
@containsChildren()
@applyTraitsMixins([
  IdentityTrait,
  LocationTrait,
  ChildTrait,
  ParentArrayTrait,
  LabelTrait,
  OwnershipTrait,
])
export class Spread extends Entity<SpreadOptions> {
  autoSort: SortingFunction

  hijacksInteractionTarget = false

  create(state: State, options: SpreadOptions = {}): void {
    this.name = def(options.name, "Spread")
    this.type = def(options.type, "spread")

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
    OwnershipTrait {}

type SpreadOptions = Partial<
  NonFunctionProperties<Mixin> & {
    autoSort: SortingFunction
  }
>

export interface Spread extends Mixin {}
