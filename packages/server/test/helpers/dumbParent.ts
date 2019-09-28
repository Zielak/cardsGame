import { Entity, applyMixins } from "../../src/traits/entity"
import {
  containsChildren,
  canBeChild,
  ParentTrait
} from "../../src/traits/parent"
import { ChildTrait } from "../../src/traits/child"
import { OwnershipTrait } from "../../src/traits/ownership"

@canBeChild
@containsChildren()
export class DumbParent extends Entity<DumbParent> {}
export interface DumbParent extends ParentTrait, ChildTrait, OwnershipTrait {}
applyMixins(DumbParent, [ParentTrait, ChildTrait, OwnershipTrait])
