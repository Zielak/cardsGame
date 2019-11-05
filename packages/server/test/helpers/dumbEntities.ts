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
@applyMixins([IdentityTrait, ParentTrait, ChildTrait])
export class DumbParent extends Entity<DumbParent> {}
export interface DumbParent extends IdentityTrait, ParentTrait, ChildTrait {}

@canBeChild
@applyMixins([IdentityTrait, ChildTrait])
export class DumbEntity extends Entity<DumbEntity> {}
export interface DumbEntity extends IdentityTrait, ChildTrait {}
