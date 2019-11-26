import { containsChildren, canBeChild } from "../annotations"
import {
  Entity,
  LabelTrait,
  applyMixins,
  OwnershipTrait,
  IdentityTrait
} from "../traits"
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
