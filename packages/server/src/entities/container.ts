import { containsChildren, canBeChild, ParentTrait } from "../traits/parent"
import { Entity, LabelTrait, applyMixins, OwnershipTrait } from "../traits"
import { ChildTrait } from "../traits/child"
import { LocationTrait } from "../traits/location"

@canBeChild
@containsChildren()
export class Container extends Entity<ContainerOptions> {}

interface Mixin
  extends LabelTrait,
    ChildTrait,
    ParentTrait,
    LocationTrait,
    OwnershipTrait {}

type ContainerOptions = Partial<ConstructorType<Mixin>>

export interface Container extends Mixin {}

applyMixins(Container, [
  LabelTrait,
  ChildTrait,
  ParentTrait,
  LocationTrait,
  OwnershipTrait
])
