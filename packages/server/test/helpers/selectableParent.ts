import { canBeChild } from "src/annotations/canBeChild"
import { containsChildren } from "src/annotations/containsChildren"
import { ChildTrait } from "src/traits/child"
import { applyTraitsMixins, Entity } from "src/traits/entity"
import { IdentityTrait } from "src/traits/identity"
import { ParentTrait } from "src/traits/parent"
import { SelectableChildrenTrait } from "src/traits/selectableChildren"

@canBeChild
@containsChildren()
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
