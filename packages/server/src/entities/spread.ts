import { def } from "@cardsgame/utils"

import { canBeChild } from "../annotations/canBeChild.js"
import { containsChildren } from "../annotations/containsChildren.js"
import type { State } from "../state/state.js"
import { ChildTrait } from "../traits/child.js"
import { applyTraitsMixins, Entity } from "../traits/entity.js"
import { IdentityTrait } from "../traits/identity.js"
import { LabelTrait } from "../traits/label.js"
import { LocationTrait } from "../traits/location.js"
import { OwnershipTrait } from "../traits/ownership.js"
import { ParentTrait } from "../traits/parent.js"

import { SortingFunction, sortOnChildAdded } from "./utils/sorting.js"

/**
 * Cards placed on the table, each neatly placed at such an angle
 * to make every card's suit and rank visible.
 *
 * Like Pile, but you can see every card. Meant for small number of entities.
 * @category Entity
 */
@canBeChild
@containsChildren
@applyTraitsMixins([
  IdentityTrait,
  LocationTrait,
  ChildTrait,
  ParentTrait,
  LabelTrait,
  OwnershipTrait,
])
export class Spread extends Entity<SpreadOptions> {
  autoSort: SortingFunction

  create(state: State, options: SpreadOptions = {}): void {
    this.name = def(options.name, "Spread")
    this.type = def(options.type, "spread")

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
    OwnershipTrait {}

type SpreadOptions = Partial<
  NonFunctionProperties<Mixin> & {
    autoSort: SortingFunction
  }
>

export interface Spread extends Mixin {}
