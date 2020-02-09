import { Entity, applyTraitsMixins } from "../../src/traits/entity"
import { ParentArrayTrait } from "../../src/traits/parentArray"
import { ChildTrait } from "../../src/traits/child"
import { LabelTrait } from "../../src/traits/label"
import { IdentityTrait } from "../../src/traits/identity"
import { OwnershipTrait } from "../../src/traits/ownership"
import { canBeChild, containsChildren } from "../../src/annotations"

@canBeChild
@containsChildren()
@applyTraitsMixins([
  IdentityTrait,
  ParentArrayTrait,
  ChildTrait,
  LabelTrait,
  OwnershipTrait
])
export class SmartParent extends Entity<SmartParentOptions> {}

interface ParentMixin
  extends IdentityTrait,
    ParentArrayTrait,
    ChildTrait,
    LabelTrait,
    OwnershipTrait {}

type SmartParentOptions = Partial<ConstructorType<ParentMixin>>

export interface SmartParent extends ParentMixin {}

// ==================================

@canBeChild
@applyTraitsMixins([IdentityTrait, ChildTrait, LabelTrait, OwnershipTrait])
export class SmartEntity extends Entity<SmartEntityOptions> {}

interface EntityMixin
  extends IdentityTrait,
    ChildTrait,
    LabelTrait,
    OwnershipTrait {}

type SmartEntityOptions = Partial<ConstructorType<EntityMixin>>

export interface SmartEntity extends EntityMixin {}
