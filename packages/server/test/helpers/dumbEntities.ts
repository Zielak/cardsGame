import { Entity, applyMixins } from "../../src/traits/entity"
import {
  containsChildren,
  canBeChild,
  ParentTrait
} from "../../src/traits/parent"
import { ChildTrait } from "../../src/traits/child"
import { IdentityTrait } from "../../src/traits"

@canBeChild
@containsChildren()
export class DumbParent extends Entity<DumbParent> {}
export interface DumbParent extends IdentityTrait, ParentTrait, ChildTrait {}
applyMixins(DumbParent, [IdentityTrait, ParentTrait, ChildTrait])

@canBeChild
export class DumbEntity extends Entity<DumbEntity> {}
export interface DumbEntity extends IdentityTrait, ChildTrait {}
applyMixins(DumbEntity, [IdentityTrait, ChildTrait])
