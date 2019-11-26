import { def } from "@cardsgame/utils"

import { canBeChild, containsChildren } from "../annotations"
import { State } from "../state"
import { Entity, applyMixins } from "../traits/entity"
import { ParentTrait } from "../traits/parent"
import { LocationTrait } from "../traits/location"
import { ChildTrait } from "../traits/child"
import { LabelTrait, IdentityTrait } from "../traits"

@canBeChild
@containsChildren()
@applyMixins([
  IdentityTrait,
  LocationTrait,
  ChildTrait,
  ParentTrait,
  LabelTrait
])
export class Pile extends Entity<PileOptions> {
  create(state: State, options: PileOptions = {}) {
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

type PileOptions = Partial<ConstructorType<Mixin>>

export interface Pile extends Mixin {}
