import { canBeChild } from "@/annotations/canBeChild.js"
import { containsChildren } from "@/annotations/containsChildren.js"
import { ChildTrait } from "@/traits/child.js"
import { applyTraitsMixins, Entity } from "@/traits/entity.js"
import { IdentityTrait } from "@/traits/identity.js"
import { OwnershipTrait } from "@/traits/ownership.js"
import { ParentTrait } from "@/traits/parent.js"

@canBeChild
@containsChildren
@applyTraitsMixins([IdentityTrait, ParentTrait, ChildTrait, OwnershipTrait])
export class OwnableParent extends Entity<OwnableParent> {}

export interface OwnableParent
  extends IdentityTrait,
    ParentTrait,
    ChildTrait,
    OwnershipTrait {}

@canBeChild
@applyTraitsMixins([IdentityTrait, ChildTrait, OwnershipTrait])
export class OwnableEntity extends Entity<OwnableEntity> {}

export interface OwnableEntity
  extends IdentityTrait,
    ChildTrait,
    OwnershipTrait {}
