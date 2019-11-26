import { Schema } from "@colyseus/schema"

import { def } from "@cardsgame/utils"

import {
  canBeChild,
  containsChildren,
  defineTypes,
  getAllChildrensTypes,
  type
} from "../annotations"
import { LocationTrait } from "../traits/location"
import { ChildTrait } from "../traits/child"
import {
  LabelTrait,
  ParentTrait,
  Entity,
  applyMixins,
  OwnershipTrait,
  IdentityTrait
} from "../traits"
import { State } from "../state"

class TopDeckElement extends Schema {}
defineTypes(TopDeckElement, getAllChildrensTypes())

@canBeChild
@containsChildren(false)
@applyMixins([
  IdentityTrait,
  LocationTrait,
  ChildTrait,
  ParentTrait,
  LabelTrait,
  OwnershipTrait
])
export class Deck extends Entity<DeckOptions> {
  @type("uint16") childCount: number

  @type(TopDeckElement) topDeck: TopDeckElement

  create(state: State, options: DeckOptions = {}) {
    this.name = def(options.name, "Deck")
    this.type = def(options.type, "deck")

    this.childCount = 0
    this.topDeck = new TopDeckElement()
  }

  // TODO: deck may display its topmost card, if it's `faceUp`

  childAdded(child: ChildTrait) {
    this.childCount++
    this.updateTopElement(child)
    // if (this.onChildAdded) {
    //   this.onChildAdded(child)
    // }
  }
  childRemoved(idx: number) {
    this.childCount--
    // if (this.onChildAdded) {
    //   this.onChildRemoved(idx)
    // }
    // if (this.childCount === 0 && this.onEmptied) {
    //   this.onEmptied()
    // } else {
    this.updateTopElement(this.getTop())
    // }
  }

  updateTopElement(child: { [key: string]: any }) {
    const whitelist = Object.keys(getAllChildrensTypes())

    whitelist.forEach(key => {
      this.topDeck[key] = child[key]
    })
  }
}

interface Mixin
  extends IdentityTrait,
    LocationTrait,
    ChildTrait,
    ParentTrait,
    LabelTrait,
    OwnershipTrait {}

// Options for the game authors to fill in
type DeckOptions = Partial<
  ConstructorType<Mixin> & {
    childCount: number
  }
>

// What I want the entity to actually contain
export interface Deck extends Mixin {}
