import { Entity, applyMixins } from "../../src/traits/entity"
import {
  containsChildren,
  canBeChild,
  ParentTrait
} from "../../src/traits/parent"
import { ChildTrait } from "../../src/traits/child"
import { IdentityTrait, LabelTrait } from "../../src/traits"

@canBeChild
@containsChildren()
export class LabeledParent extends Entity<LabeledParent> {}

export interface LabeledParent
  extends IdentityTrait,
    ParentTrait,
    ChildTrait,
    LabelTrait {}

applyMixins(LabeledParent, [IdentityTrait, ParentTrait, ChildTrait, LabelTrait])

@canBeChild
export class LabeledEntity extends Entity<LabeledEntity> {}

export interface LabeledEntity extends IdentityTrait, ChildTrait, LabelTrait {}

applyMixins(LabeledEntity, [IdentityTrait, ChildTrait, LabelTrait])
