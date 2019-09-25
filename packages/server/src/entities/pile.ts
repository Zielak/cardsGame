import { def } from "@cardsgame/utils"
import { Entity, applyMixins } from "../traits/entity"
import { containsChildren, canBeChild, ParentTrait } from "../traits/parent"
import { State } from "../state"
import { LocationTrait } from "../traits/location"
import { ChildTrait } from "../traits/child"
import { IdentityTrait } from "../traits"

@canBeChild
@containsChildren()
export class Pile extends Entity {
  constructor(state: State, options?: Partial<Pile>) {
    super(state, options)

    this.name = def(options.name, "Pile")
    this.type = def(options.type, "pile")
  }
}

export interface Pile
  extends LocationTrait,
    ChildTrait,
    ParentTrait,
    IdentityTrait {}

applyMixins(Pile, [LocationTrait, ChildTrait, ParentTrait, IdentityTrait])
