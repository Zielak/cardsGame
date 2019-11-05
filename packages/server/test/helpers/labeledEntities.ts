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
@applyMixins([IdentityTrait, ParentTrait, ChildTrait, LabelTrait])
export class LabeledParent extends Entity<LabeledParent> {}

export interface LabeledParent
  extends IdentityTrait,
    ParentTrait,
    ChildTrait,
    LabelTrait {}

@canBeChild
@applyMixins([IdentityTrait, ChildTrait, LabelTrait])
export class LabeledEntity extends Entity<LabeledEntity> {}

export interface LabeledEntity extends IdentityTrait, ChildTrait, LabelTrait {}
