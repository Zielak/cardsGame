import { Entity, applyTraitsMixins } from "../../src/traits/entity"
import { ParentArrayTrait } from "../../src/traits/parentArray"
import { ChildTrait } from "../../src/traits/child"
import { IdentityTrait } from "../../src/traits/identity"
import { OwnershipTrait } from "../../src/traits/ownership"
import { canBeChild, containsChildren } from "../../src/annotations"

@canBeChild
@containsChildren()
@applyTraitsMixins([
  IdentityTrait,
  ParentArrayTrait,
  ChildTrait,
  OwnershipTrait
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
