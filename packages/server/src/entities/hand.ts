/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
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
import { SelectableChildrenTrait } from "../traits/selectableChildren.js"

import { SortingFunction, sortOnChildAdded } from "./utils/sorting.js"

/**
 * Hand of cards.
 *
 * Give it a special rendering on client side.
 *
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
