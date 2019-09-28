import { def } from "@cardsgame/utils"
import { Entity, applyMixins } from "../traits/entity"
import { containsChildren, canBeChild, ParentTrait } from "../traits/parent"
import { State } from "../state"
import { LocationTrait } from "../traits/location"
import { ChildTrait } from "../traits/child"
import { LabelTrait } from "../traits"

@canBeChild
@containsChildren()
export class Pile extends Entity<PileOptions> {
  constructor(state: State, options: Partial<Pile> = {}) {
    super(state, options)

    this.name = def(options.name, "Pile")
    this.type = def(options.type, "pile")
  }
}

export interface PileOptions
  extends LocationTrait,
    ChildTrait,
    ParentTrait,
    LabelTrait {}

export interface Pile extends PileOptions {}

applyMixins(Pile, [LocationTrait, ChildTrait, ParentTrait, LabelTrait])
