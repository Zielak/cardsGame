/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { def } from "@cardsgame/utils"

import { canBeChild } from "@/annotations/canBeChild.js"
import { containsChildren } from "@/annotations/containsChildren.js"
import type { State } from "@/state/state.js"
import { ChildTrait } from "@/traits/child.js"
import { applyTraitsMixins, Entity } from "@/traits/entity.js"
import { IdentityTrait } from "@/traits/identity.js"
import { LabelTrait } from "@/traits/label.js"
import { LocationTrait } from "@/traits/location.js"
import { OwnershipTrait } from "@/traits/ownership.js"
import { ParentTrait } from "@/traits/parent.js"

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
