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

/**
 * Generic container with no special "looks" assigned to it.
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
  LocationTrait,
  OwnershipTrait,
])
export class Container extends Entity<ContainerOptions> {
  create(state: State, options: ContainerOptions = {}): void {
    this.type = "container"

    this.hijacksInteractionTarget = def(options.hijacksInteractionTarget, false)
  }
}

interface Mixin
  extends IdentityTrait,
    LabelTrait,
    ChildTrait,
    ParentTrait,
    LocationTrait,
    OwnershipTrait {}

type ContainerOptions = Partial<NonFunctionProperties<Mixin>>

export interface Container extends Mixin {}
