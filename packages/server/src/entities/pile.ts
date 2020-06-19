import { def } from "@cardsgame/utils"

import { canBeChild } from "../annotations/canBeChild"
import { containsChildren } from "../annotations/containsChildren"
import { State } from "../state/state"
import { ChildTrait } from "../traits/child"
import { applyTraitsMixins, Entity } from "../traits/entity"
import { IdentityTrait } from "../traits/identity"
import { LabelTrait } from "../traits/label"
import { LocationTrait } from "../traits/location"
import { ParentArrayTrait } from "../traits/parentArray"

@canBeChild
@containsChildren()
@applyTraitsMixins([
  IdentityTrait,
  LocationTrait,
  ChildTrait,
  ParentArrayTrait,
  LabelTrait,
])
export class Pile extends Entity<PileOptions> {
  create(state: State, options: PileOptions = {}): void {
    this.name = def(options.name, "Pile")
    this.type = def(options.type, "pile")
  }
}

interface Mixin
  extends IdentityTrait,
    LocationTrait,
    ChildTrait,
    ParentArrayTrait,
    LabelTrait {}

type PileOptions = Partial<NonFunctionProperties<Mixin>>

export interface Pile extends Mixin {}
