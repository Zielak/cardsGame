import { Entity, applyMixins } from "../../src/traits/entity"
import { ParentArrayTrait } from "../../src/traits/parentArray"
import { ChildTrait } from "../../src/traits/child"
import { IdentityTrait } from "../../src/traits/identity"
import { LabelTrait } from "../../src/traits/label"
import { canBeChild, containsChildren } from "../../src/annotations"

@canBeChild
@containsChildren()
@applyMixins([IdentityTrait, ParentArrayTrait, ChildTrait, LabelTrait])
export class LabeledParent extends Entity<LabeledParent> {}

export interface LabeledParent
  extends IdentityTrait,
    ParentArrayTrait,
    ChildTrait,
    LabelTrait {}

@canBeChild
@applyMixins([IdentityTrait, ChildTrait, LabelTrait])
export class LabeledEntity extends Entity<LabeledEntity> {}

export interface LabeledEntity extends IdentityTrait, ChildTrait, LabelTrait {}
