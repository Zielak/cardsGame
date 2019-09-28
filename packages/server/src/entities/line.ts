import {
  Entity,
  ParentTrait,
  LabelTrait,
  applyMixins,
  canBeChild,
  containsChildren
} from "../traits"
import { LocationTrait } from "../traits/location"
import { ChildTrait } from "../traits/child"

/**
 * TODO: finish it for SUPERHOT, but only once I'm almost done with everything
 * Row or column of set number of cards.
 * It contains maximum number of spots for cards.
 * A spot can be empty.
 */
@canBeChild
@containsChildren()
export class Line extends Entity<LineOptions> {}

export interface LineOptions
  extends LocationTrait,
    ChildTrait,
    ParentTrait,
    LabelTrait {}

export interface Line extends LineOptions {}

applyMixins(Line, [LocationTrait, ChildTrait, ParentTrait, LabelTrait])
