import { canBeChild } from "../../src/traits/parent"
import { Entity, applyMixins } from "../../src/traits"
import { ChildTrait } from "../../src/traits/child"
import { OwnershipTrait } from "../../src/traits/ownership"

@canBeChild
export class DumbEntity extends Entity<DumbEntity> {}
export interface DumbEntity extends ChildTrait, OwnershipTrait {}
applyMixins(DumbEntity, [ChildTrait, OwnershipTrait])
