import { def, logs } from "@cardsgame/utils"

import { canBeChild } from "../annotations/canBeChild"
import { containsChildren } from "../annotations/containsChildren"
import type { State } from "../state"
import { ChildTrait } from "../traits"
import { applyTraitsMixins, Entity } from "../traits/entity"
import { IdentityTrait } from "../traits/identity"
import { LabelTrait } from "../traits/label"
import { OwnershipTrait } from "../traits/ownership"
import { ParentTrait } from "../traits/parent"

/**
 * **"Virtual"** container representing selected entities.
 * Can't be put inside any container, can't be found by queries.
 *
 * Example: grabbed cards to be moved into another container.
 *
 * @category Entity
 */
@canBeChild
@containsChildren
@applyTraitsMixins([
  IdentityTrait,
  LabelTrait,
  ChildTrait,
  ParentTrait,
  OwnershipTrait,
])
export class Selection extends Entity<SelectionOptions> {
  create(state: State, options: SelectionOptions = {}): void {
    this.type = "selection"

    if (options.parent) {
      delete options.parent
      logs.warn(
        "Selection container must stay at top level. Removing `options.parent`."
      )
    }

    this.hijacksInteractionTarget = def(options.hijacksInteractionTarget, true)
  }
}

interface Mixin
  extends IdentityTrait,
    LabelTrait,
    ChildTrait,
    ParentTrait,
    OwnershipTrait {}

type SelectionOptions = Partial<NonFunctionProperties<Mixin>>

export interface Selection extends Mixin {}
