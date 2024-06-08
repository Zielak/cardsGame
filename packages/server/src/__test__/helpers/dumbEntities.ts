import { canBeChild } from "@/annotations/canBeChild.js"
import { containsChildren } from "@/annotations/containsChildren.js"
import { ChildTrait } from "@/traits/child.js"
import { applyTraitsMixins, Entity } from "@/traits/entity.js"
import { IdentityTrait } from "@/traits/identity.js"
import { ParentTrait } from "@/traits/parent.js"

@canBeChild
@containsChildren
@applyTraitsMixins([IdentityTrait, ParentTrait, ChildTrait])
export class DumbParent extends Entity<DumbParent> {}
export interface DumbParent extends IdentityTrait, ParentTrait, ChildTrait {}

@canBeChild
@applyTraitsMixins([IdentityTrait, ChildTrait])
export class DumbEntity extends Entity<DumbEntity> {}
export interface DumbEntity extends IdentityTrait, ChildTrait {}
