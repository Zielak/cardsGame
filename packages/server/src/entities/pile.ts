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

/**
 * Loose pile of discarded items.
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
export class Pile extends Entity<PileOptions> {
  create(state: State, options: PileOptions = {}): void {
    this.name = def(options.name, "Pile")
    this.type = def(options.type, "pile")

    this.hijacksInteractionTarget = def(options.hijacksInteractionTarget, true)
  }
}

interface Mixin
  extends IdentityTrait,
    LocationTrait,
    ChildTrait,
    ParentTrait,
    LabelTrait,
    OwnershipTrait {}

type PileOptions = Partial<NonFunctionProperties<Mixin>>

export interface Pile extends Mixin {}
