import { type } from "@colyseus/schema"
import { def } from "@cardsgame/utils"
import { containsChildren, canBeChild } from "../traits/parent"
import { LocationTrait } from "../traits/location"
import { ChildTrait } from "../traits/child"
import { IdentityTrait, ParentTrait, Entity, applyMixins } from "../traits"
import { State } from "../state"

@canBeChild
@containsChildren(false)
export class Deck extends Entity {
  @type("uint16")
  childCount: number = 0

  onEmptied: () => void

  // TODO: deck may display its topmost card, if it's `faceUp`

  childAdded(child: ChildTrait) {
    this.childCount++
    if (this.onChildAdded) {
      this.onChildAdded(child)
    }
  }
  childRemoved(idx: number) {
    this.childCount--
    if (this.onChildAdded) {
      this.onChildRemoved(idx)
    }
    if (this.childCount === 0 && this.onEmptied) {
      this.onEmptied()
    }
  }

  constructor(state: State, options?: Partial<Deck>) {
    super(state, options)
    this.onEmptied = def(options.onEmptied, undefined)
    this.name = def(options.name, "Deck")
    this.type = def(options.type, "deck")
  }
}

export interface Deck
  extends LocationTrait,
    ChildTrait,
    ParentTrait,
    IdentityTrait {}

applyMixins(Deck, [LocationTrait, ChildTrait, ParentTrait, IdentityTrait])
