import { canBeChild } from "src/annotations/canBeChild"
import { containsChildren } from "src/annotations/containsChildren"
import { ChildTrait } from "src/traits/child"
import { applyTraitsMixins, Entity } from "src/traits/entity"
import { IdentityTrait } from "src/traits/identity"
import { ParentTrait } from "src/traits/parent"

@canBeChild
@containsChildren
@applyTraitsMixins([IdentityTrait, ParentTrait, ChildTrait])
export class DumbParent extends Entity<DumbParent> {}
export interface DumbParent extends IdentityTrait, ParentTrait, ChildTrait {}

@canBeChild
@applyTraitsMixins([IdentityTrait, ChildTrait])
export class DumbEntity extends Entity<DumbEntity> {}
export interface DumbEntity extends IdentityTrait, ChildTrait {}
