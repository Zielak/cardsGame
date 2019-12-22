import { canBeChild, containsChildren } from "../../src/annotations"
import { ChildTrait } from "../../src/traits/child"
import { Entity, applyMixins } from "../../src/traits/entity"
import { IdentityTrait } from "../../src/traits/identity"
import { ParentArrayTrait } from "../../src/traits/parentArray"
import { SelectableChildrenTrait } from "../../src/traits/selectableChildren"

@canBeChild
@containsChildren()
@applyMixins([
  IdentityTrait,
  ParentArrayTrait,
  ChildTrait,
  SelectableChildrenTrait
])
export class SelectableParent extends Entity<SelectableParentOptions> {}

interface ParentMixin
  extends IdentityTrait,
    ParentArrayTrait,
    ChildTrait,
    SelectableChildrenTrait {}

type SelectableParentOptions = Partial<ConstructorType<ParentMixin>>

export interface SelectableParent extends ParentMixin {}
