import { Entity, applyTraitsMixins } from "../../src/traits/entity"
import { ParentArrayTrait } from "../../src/traits/parentArray"
import { ChildTrait } from "../../src/traits/child"
import { LabelTrait } from "../../src/traits/label"
import { IdentityTrait } from "../../src/traits/identity"
import { OwnershipTrait } from "../../src/traits/ownership"
import { canBeChild, containsChildren } from "../../src/annotations"
import { State } from "../../src/state"

@canBeChild
@containsChildren()
@applyTraitsMixins([
  IdentityTrait,
  ParentArrayTrait,
  ChildTrait,
  LabelTrait,
  OwnershipTrait
])
export class SmartParent extends Entity<SmartParentOptions> {
  type = "smartParent"
  customProp: string

  create(state: State, options: SmartParentOptions = {}) {
    this.customProp = options.customProp || ""
  }
}

interface ParentMixin
  extends IdentityTrait,
    ParentArrayTrait,
    ChildTrait,
    LabelTrait,
    OwnershipTrait {}

type SmartParentOptions = Partial<
  ConstructorType<ParentMixin> & {
    customProp: string
  }
>

export interface SmartParent extends ParentMixin {}

// ==================================

@canBeChild
@applyTraitsMixins([IdentityTrait, ChildTrait, LabelTrait, OwnershipTrait])
export class SmartEntity extends Entity<SmartEntityOptions> {
  type = "smartEntity"
  customProp: string

  create(state: State, options: SmartEntityOptions = {}) {
    this.customProp = options.customProp || ""
  }
}

interface EntityMixin
  extends IdentityTrait,
    ChildTrait,
    LabelTrait,
    OwnershipTrait {}

type SmartEntityOptions = Partial<
  ConstructorType<EntityMixin> & {
    customProp: string
  }
>

export interface SmartEntity extends EntityMixin {}
