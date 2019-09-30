import { Entity, applyMixins } from "../../src/traits/entity"
import {
  containsChildren,
  canBeChild,
  ParentTrait
} from "../../src/traits/parent"
import { ChildTrait } from "../../src/traits/child"
import { IdentityTrait } from "../../src/traits"
import { OwnershipTrait } from "../../src/traits/ownership"

@canBeChild
@containsChildren()
export class OwnableParent extends Entity<OwnableParent> {}

export interface OwnableParent
  extends IdentityTrait,
    ParentTrait,
    ChildTrait,
    OwnershipTrait {}

applyMixins(OwnableParent, [
  IdentityTrait,
  ParentTrait,
  ChildTrait,
  OwnershipTrait
])

@canBeChild
export class OwnableEntity extends Entity<OwnableEntity> {}

export interface OwnableEntity
  extends IdentityTrait,
    ChildTrait,
    OwnershipTrait {}

applyMixins(OwnableEntity, [IdentityTrait, ChildTrait, OwnershipTrait])
