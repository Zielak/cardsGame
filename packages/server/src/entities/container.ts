import { containsChildren, canBeChild, ParentTrait } from "../traits/parent"
import { Entity, IdentityTrait, applyMixins } from "../traits"
import { ChildTrait } from "../traits/child"
import { LocationTrait } from "../traits/location"

@canBeChild
@containsChildren()
export class Container extends Entity {}

export interface Container
  extends IdentityTrait,
    ChildTrait,
    ParentTrait,
    LocationTrait {}

applyMixins(Container, [IdentityTrait, ChildTrait, ParentTrait, LocationTrait])
