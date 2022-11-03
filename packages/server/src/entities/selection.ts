import { def, logs } from "@cardsgame/utils"

import { canBeChild } from "../annotations/canBeChild.js"
import { containsChildren } from "../annotations/containsChildren.js"
import type { State } from "../state/state.js"
import { ChildTrait } from "../traits/child.js"
import { applyTraitsMixins, Entity } from "../traits/entity.js"
import { IdentityTrait } from "../traits/identity.js"
import { LabelTrait } from "../traits/label.js"
import { OwnershipTrait } from "../traits/ownership.js"
import { ParentTrait } from "../traits/parent.js"

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
