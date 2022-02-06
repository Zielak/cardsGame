import { def } from "@cardsgame/utils"

import { canBeChild } from "../../src/annotations/canBeChild"
import { containsChildren } from "../../src/annotations/containsChildren"
import type { State } from "../../src/state"
import { ChildTrait } from "../../src/traits/child"
import { applyTraitsMixins, Entity } from "../../src/traits/entity"
import { IdentityTrait } from "../../src/traits/identity"
import { LabelTrait } from "../../src/traits/label"
import { OwnershipTrait } from "../../src/traits/ownership"
import { ParentTrait } from "../../src/traits/parent"

@canBeChild
@containsChildren()
@applyTraitsMixins([
  IdentityTrait,
  ParentTrait,
  ChildTrait,
  LabelTrait,
  OwnershipTrait,
])
export class SmartParent extends Entity<SmartParentOptions> {
  // @deprecate
  customProp: string

  create(state: State, options: SmartParentOptions = {}): void {
    this.customProp = options.customProp || ""
    this.type = def(options.type, "smartParent")
  }
}

interface ParentMixin
  extends IdentityTrait,
    ParentTrait,
    ChildTrait,
    LabelTrait,
    OwnershipTrait {}

type SmartParentOptions = Partial<
  NonFunctionProperties<ParentMixin> & {
    customProp: string
  }
>

export interface SmartParent extends ParentMixin {}

// ==================================

@canBeChild
@applyTraitsMixins([IdentityTrait, ChildTrait, LabelTrait, OwnershipTrait])
export class SmartEntity extends Entity<SmartEntityOptions> {
  customProp: string

  create(state: State, options: SmartEntityOptions = {}): void {
    this.customProp = def(options.customProp, "")
    this.type = def(options.type, "smartEntity")
  }
}

interface EntityMixin
  extends IdentityTrait,
    ChildTrait,
    LabelTrait,
    OwnershipTrait {}

type SmartEntityOptions = Partial<
  NonFunctionProperties<EntityMixin> & {
    customProp: string
  }
>

export interface SmartEntity extends EntityMixin {}
