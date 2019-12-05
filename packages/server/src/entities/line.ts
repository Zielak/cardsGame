import { def } from "@cardsgame/utils"

import { canBeChild, containsChildren } from "../annotations"
import { Entity, applyMixins } from "../traits/entity"
import { ParentTrait } from "../traits/parent"
import { LabelTrait } from "../traits/label"
import { IdentityTrait } from "../traits/identity"
import { SelectableChildrenTrait } from "../traits/selectableChildren"
import { LocationTrait } from "../traits/location"
import { ChildTrait } from "../traits/child"
import { State } from "../state"

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
  spots: number

  create(state: State, options: LineOptions = {}) {
    this.name = def(options.name, "Line")
    this.type = def(options.type, "line")

    this.spots = options.spots
  }
}

interface Mixin
  extends IdentityTrait,
    LocationTrait,
    ChildTrait,
    ParentTrait,
    LabelTrait,
    SelectableChildrenTrait {}

type LineOptions = Partial<
  ConstructorType<Mixin> & {
    spots: number
  }
>

export interface Line extends Mixin {}
