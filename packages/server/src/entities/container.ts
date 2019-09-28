import { containsChildren, canBeChild, ParentTrait } from "../traits/parent"
import { Entity, LabelTrait, applyMixins } from "../traits"
import { ChildTrait } from "../traits/child"
import { LocationTrait } from "../traits/location"

@canBeChild
@containsChildren()
export class Container extends Entity<ContainerOptions> {}

export interface ContainerOptions
  extends LabelTrait,
    ChildTrait,
    ParentTrait,
    LocationTrait {}

export interface Container extends ContainerOptions {}

applyMixins(Container, [LabelTrait, ChildTrait, ParentTrait, LocationTrait])
