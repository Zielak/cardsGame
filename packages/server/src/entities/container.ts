import { containsChildren, canBeChild, ParentTrait } from "../traits/parent"
import { Entity, LabelTrait, applyMixins, OwnershipTrait } from "../traits"
import { ChildTrait } from "../traits/child"
import { LocationTrait } from "../traits/location"
import { State } from "../state"

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
}

interface Mixin
  extends LabelTrait,
    ChildTrait,
    ParentTrait,
    LocationTrait,
    OwnershipTrait {}

type ContainerOptions = Partial<ConstructorType<Mixin>>

export interface Container extends Mixin {}
