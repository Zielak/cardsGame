import { containsChildren, canBeChild, ParentTrait } from "../traits/parent"
import { Entity, LabelTrait, applyMixins } from "../traits"
import { ChildTrait } from "../traits/child"
import { LocationTrait } from "../traits/location"

@canBeChild
@containsChildren()
export class Container extends Entity<ContainerOptions> {}

interface Mixin extends LabelTrait, ChildTrait, ParentTrait, LocationTrait {}

type ContainerOptions = Partial<ConstructorType<Mixin>>

export interface Container extends Mixin {}

applyMixins(Container, [LabelTrait, ChildTrait, ParentTrait, LocationTrait])
