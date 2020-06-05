import { canBeChild } from "../../src/annotations/canBeChild"
import { containsChildren } from "../../src/annotations/containsChildren"
import { ChildTrait } from "../../src/traits/child"
import { applyTraitsMixins, Entity } from "../../src/traits/entity"
import { IdentityTrait } from "../../src/traits/identity"
import { OwnershipTrait } from "../../src/traits/ownership"
import { ParentArrayTrait } from "../../src/traits/parentArray"

@canBeChild
@containsChildren()
@applyTraitsMixins([
  IdentityTrait,
  ParentArrayTrait,
  ChildTrait,
  OwnershipTrait,
])
export class OwnableParent extends Entity<OwnableParent> {}

export interface OwnableParent
  extends IdentityTrait,
    ParentArrayTrait,
    ChildTrait,
    OwnershipTrait {}

@canBeChild
@applyTraitsMixins([IdentityTrait, ChildTrait, OwnershipTrait])
export class OwnableEntity extends Entity<OwnableEntity> {}

export interface OwnableEntity
  extends IdentityTrait,
    ChildTrait,
    OwnershipTrait {}
