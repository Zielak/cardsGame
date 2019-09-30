import { def } from "@cardsgame/utils"

import { canBeChild, containsChildren, ParentTrait } from "../traits/parent"
import { State } from "../state"
import { FlexyTrait } from "../traits/flexyContainer"
import { LocationTrait } from "../traits/location"
import { ChildTrait } from "../traits/child"
import { LabelTrait, Entity, applyMixins } from "../traits"

@canBeChild
@containsChildren()
export class Row extends Entity<RowOptions> {
  constructor(state: State, options: RowOptions = {}) {
    super(state, options)

    this.name = def(options.name, "Row")
    this.type = def(options.type, "row")
  }
}

interface Mixin
  extends LocationTrait,
    ChildTrait,
    ParentTrait,
    LabelTrait,
    FlexyTrait {}

type RowOptions = Partial<ConstructorType<Mixin>>

export interface Row extends Mixin {}

applyMixins(Row, [
  LocationTrait,
  ChildTrait,
  ParentTrait,
  LabelTrait,
  FlexyTrait
])
