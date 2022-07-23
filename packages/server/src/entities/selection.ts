import { def } from "@cardsgame/utils"

import { canBeChild } from "../annotations/canBeChild"
import { containsChildren } from "../annotations/containsChildren"
import type { State } from "../state"
import { applyTraitsMixins, Entity } from "../traits/entity"
import { IdentityTrait } from "../traits/identity"
import { LabelTrait } from "../traits/label"
import { OwnershipTrait } from "../traits/ownership"
import { ParentTrait } from "../traits/parent"

/**
 * "Virtual" container representing selected entities.
 *
 * Example: grabbed cards to be moved into another container.
 *
 * @category Entity
 */
@canBeChild
@containsChildren
@applyTraitsMixins([IdentityTrait, LabelTrait, ParentTrait, OwnershipTrait])
export class Selection extends Entity<SelectionOptions> {
  create(state: State, options: SelectionOptions = {}): void {
    this.type = "selection"

    this.hijacksInteractionTarget = def(options.hijacksInteractionTarget, true)
  }
}

interface Mixin
  extends IdentityTrait,
    LabelTrait,
    ParentTrait,
    OwnershipTrait {}

type SelectionOptions = Partial<NonFunctionProperties<Mixin>>

export interface Selection extends Mixin {}
