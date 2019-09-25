import { def } from "@cardsgame/utils"

import { canBeChild, containsChildren, ParentTrait } from "../traits/parent"
import { State } from "../state"
import { FlexyTrait } from "../traits/flexyContainer"
import { LocationTrait } from "../traits/location"
import { ChildTrait } from "../traits/child"
import { IdentityTrait, Entity, applyMixins } from "../traits"

@canBeChild
@containsChildren()
export class Row extends Entity {
  constructor(state: State, options?: Partial<Row>) {
    super(state, options)

    this.name = def(options.name, "Row")
    this.type = def(options.type, "row")
  }
}

export interface Row
  extends LocationTrait,
    ChildTrait,
    ParentTrait,
    IdentityTrait,
    FlexyTrait {}

applyMixins(Row, [
  LocationTrait,
  ChildTrait,
  ParentTrait,
  IdentityTrait,
  FlexyTrait
])
