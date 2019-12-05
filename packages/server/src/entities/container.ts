import { containsChildren, canBeChild } from "../annotations"
import { LabelTrait } from "../traits/label"
import { OwnershipTrait } from "../traits/ownership"
import { IdentityTrait } from "../traits/identity"
import { Entity, applyMixins } from "../traits/entity"
import { ParentTrait } from "../traits/parent"
import { ChildTrait } from "../traits/child"
import { LocationTrait } from "../traits/location"

@canBeChild
@containsChildren()
@applyMixins([
  IdentityTrait,
  LabelTrait,
  ChildTrait,
  ParentTrait,
  LocationTrait,
  OwnershipTrait
])
export class Container extends Entity<ContainerOptions> {
  create() {
    this.type = "container"
    this.hijacksInteractionTarget = false
  }
}

interface Mixin
  extends IdentityTrait,
    LabelTrait,
    ChildTrait,
    ParentTrait,
    LocationTrait,
    OwnershipTrait {}

type ContainerOptions = Partial<ConstructorType<Mixin>>

export interface Container extends Mixin {}
