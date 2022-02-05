import { canBeChild } from "../../src/annotations/canBeChild"
import { containsChildren } from "../../src/annotations/containsChildren"
import { ChildTrait } from "../../src/traits/child"
import { applyTraitsMixins, Entity } from "../../src/traits/entity"
import { IdentityTrait } from "../../src/traits/identity"
import { OwnershipTrait } from "../../src/traits/ownership"
import { ParentTrait } from "../../src/traits/parent"

@canBeChild
@containsChildren()
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
