import { Entity, applyMixins } from "../../src/traits/entity"
import {
  containsChildren,
  canBeChild,
  ParentTrait
} from "../../src/traits/parent"
import { ChildTrait } from "../../src/traits/child"
import { IdentityTrait, LabelTrait } from "../../src/traits"
import { OwnershipTrait } from "../../src/traits/ownership"

@canBeChild
@containsChildren()
export class SmartParent extends Entity<SmartParent> {}

export interface SmartParent
  extends IdentityTrait,
    ParentTrait,
    ChildTrait,
    LabelTrait,
    OwnershipTrait {}

applyMixins(SmartParent, [
  IdentityTrait,
  ParentTrait,
  ChildTrait,
  LabelTrait,
  OwnershipTrait
])

@canBeChild
export class SmartEntity extends Entity<SmartEntity> {}

export interface SmartEntity
  extends IdentityTrait,
    ChildTrait,
    LabelTrait,
    OwnershipTrait {}

applyMixins(SmartEntity, [
  IdentityTrait,
  ChildTrait,
  LabelTrait,
  OwnershipTrait
])
