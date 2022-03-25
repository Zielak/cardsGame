import { def } from "@cardsgame/utils"

import { canBeChild } from "../annotations/canBeChild"
import { containsChildren } from "../annotations/containsChildren"
import type { State } from "../state"
import { ChildTrait } from "../traits/child"
import { applyTraitsMixins, Entity } from "../traits/entity"
import { IdentityTrait } from "../traits/identity"
import { LabelTrait } from "../traits/label"
import { LocationTrait } from "../traits/location"
import { ParentTrait } from "../traits/parent"

/**
 * @category Entity
 */
@canBeChild
@containsChildren()
@applyTraitsMixins([
  IdentityTrait,
  LocationTrait,
  ChildTrait,
  ParentTrait,
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
    ParentTrait,
    LabelTrait {}

type PileOptions = Partial<NonFunctionProperties<Mixin>>

export interface Pile extends Mixin {}
