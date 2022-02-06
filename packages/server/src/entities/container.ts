import { canBeChild } from "../annotations/canBeChild"
import { containsChildren } from "../annotations/containsChildren"
import { ChildTrait } from "../traits/child"
import { applyTraitsMixins, Entity } from "../traits/entity"
import { IdentityTrait } from "../traits/identity"
import { LabelTrait } from "../traits/label"
import { LocationTrait } from "../traits/location"
import { OwnershipTrait } from "../traits/ownership"
import { ParentTrait } from "../traits/parent"

@canBeChild
@containsChildren()
@applyTraitsMixins([
  IdentityTrait,
  LabelTrait,
  ChildTrait,
  ParentTrait,
  LocationTrait,
  OwnershipTrait,
])
export class Container extends Entity<ContainerOptions> {
  hijacksInteractionTarget = false
  create(): void {
    this.type = "container"
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
