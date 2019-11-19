import { containsChildren, canBeChild } from "../annotations"
import { Entity, LabelTrait, applyMixins, OwnershipTrait } from "../traits"
import { ParentTrait } from "../traits/parent"
import { ChildTrait } from "../traits/child"
import { LocationTrait } from "../traits/location"

@canBeChild
@containsChildren()
@applyMixins([
  LabelTrait,
  ChildTrait,
  ParentTrait,
  LocationTrait,
  OwnershipTrait
])
export class Container extends Entity<ContainerOptions> {
  type = "container"
  hijacksInteractionTarget = false
}

interface Mixin
  extends LabelTrait,
    ChildTrait,
    ParentTrait,
    LocationTrait,
    OwnershipTrait {}

type ContainerOptions = Partial<ConstructorType<Mixin>>

export interface Container extends Mixin {}
