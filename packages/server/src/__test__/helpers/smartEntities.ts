import { def } from "@cardsgame/utils"

import { canBeChild } from "../../annotations/canBeChild.js"
import { containsChildren } from "../../annotations/containsChildren.js"
import type { State } from "../../state/state.js"
import { ChildTrait } from "../../traits/child.js"
import { applyTraitsMixins, Entity } from "../../traits/entity.js"
import { IdentityTrait } from "../../traits/identity.js"
import { LabelTrait } from "../../traits/label.js"
import { OwnershipTrait } from "../../traits/ownership.js"
import { ParentTrait } from "../../traits/parent.js"

@canBeChild
@containsChildren
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
