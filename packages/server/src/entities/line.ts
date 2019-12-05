import { canBeChild, containsChildren } from "../annotations"
import {
  Entity,
  ParentTrait,
  LabelTrait,
  applyMixins,
  IdentityTrait,
  SelectableChildrenTrait
} from "../traits"
import { LocationTrait } from "../traits/location"
import { ChildTrait } from "../traits/child"

/**
 * Row or column of set number of cards.
 * It contains maximum number of spots for cards.
 * A spot can be empty.
 */
@canBeChild
@containsChildren()
@applyMixins([
  IdentityTrait,
  LocationTrait,
  ChildTrait,
  ParentTrait,
  LabelTrait,
  SelectableChildrenTrait
])
export class Line extends Entity<LineOptions> {
  create() {}
}

interface Mixin
  extends IdentityTrait,
    LocationTrait,
    ChildTrait,
    ParentTrait,
    LabelTrait,
    SelectableChildrenTrait {}

type LineOptions = Partial<ConstructorType<Mixin>>

export interface Line extends Mixin {}
