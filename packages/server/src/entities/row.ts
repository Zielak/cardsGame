import { def } from "@cardsgame/utils"

import { canBeChild, containsChildren } from "../annotations"
import { State } from "../state"
import { LabelTrait, Entity, applyMixins } from "../traits"
import { ParentTrait } from "../traits/parent"
import { FlexyTrait } from "../traits/flexyContainer"
import { LocationTrait } from "../traits/location"
import { ChildTrait } from "../traits/child"

@canBeChild
@containsChildren()
@applyMixins([LocationTrait, ChildTrait, ParentTrait, LabelTrait, FlexyTrait])
export class Row extends Entity<RowOptions> {
  create(state: State, options: RowOptions = {}) {
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
