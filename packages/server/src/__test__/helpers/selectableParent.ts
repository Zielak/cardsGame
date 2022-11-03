import { canBeChild } from "../../annotations/canBeChild.js"
import { containsChildren } from "../../annotations/containsChildren.js"
import { ChildTrait } from "../../traits/child.js"
import { applyTraitsMixins, Entity } from "../../traits/entity.js"
import { IdentityTrait } from "../../traits/identity.js"
import { ParentTrait } from "../../traits/parent.js"
import { SelectableChildrenTrait } from "../../traits/selectableChildren.js"

@canBeChild
@containsChildren
@applyTraitsMixins([
  IdentityTrait,
  ParentTrait,
  ChildTrait,
  SelectableChildrenTrait,
])
export class SelectableParent extends Entity<SelectableParentOptions> {}

interface ParentMixin
  extends IdentityTrait,
    ParentTrait,
    ChildTrait,
    SelectableChildrenTrait {}

type SelectableParentOptions = Partial<NonFunctionProperties<ParentMixin>>

export interface SelectableParent extends ParentMixin {}
