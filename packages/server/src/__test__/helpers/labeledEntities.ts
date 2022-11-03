import { canBeChild } from "../../annotations/canBeChild.js"
import { containsChildren } from "../../annotations/containsChildren.js"
import { ChildTrait } from "../../traits/child.js"
import { applyTraitsMixins, Entity } from "../../traits/entity.js"
import { IdentityTrait } from "../../traits/identity.js"
import { LabelTrait } from "../../traits/label.js"
import { ParentTrait } from "../../traits/parent.js"

@canBeChild
@containsChildren
@applyTraitsMixins([IdentityTrait, ParentTrait, ChildTrait, LabelTrait])
export class LabeledParent extends Entity<LabeledParent> {}

export interface LabeledParent
  extends IdentityTrait,
    ParentTrait,
    ChildTrait,
    LabelTrait {}

@canBeChild
@applyTraitsMixins([IdentityTrait, ChildTrait, LabelTrait])
export class LabeledEntity extends Entity<LabeledEntity> {}

export interface LabeledEntity extends IdentityTrait, ChildTrait, LabelTrait {}
