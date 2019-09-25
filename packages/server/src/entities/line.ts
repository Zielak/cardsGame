import { Entity, ParentTrait, IdentityTrait, applyMixins } from "../traits"
import { LocationTrait } from "../traits/location"
import { ChildTrait } from "../traits/child"

/**
 * TODO: finish it for SUPERHOT, but only once I'm almost done with everything
 * Row or column of set number of cards.
 * It contains maximum number of spots for cards.
 * A spot can be empty.
 */
export class Line extends Entity {}

export interface Line
  extends LocationTrait,
    ChildTrait,
    ParentTrait,
    IdentityTrait {}

applyMixins(Line, [LocationTrait, ChildTrait, ParentTrait, IdentityTrait])
