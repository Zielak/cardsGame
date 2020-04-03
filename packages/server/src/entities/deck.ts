import { Schema } from "@colyseus/schema"

import { def } from "@cardsgame/utils"

import {
  canBeChild,
  containsChildren,
  defineTypes,
  getAllChildrensTypes,
  type,
} from "../annotations"
import { State } from "../state"

import { ChildTrait } from "../traits/child"
import { Entity, applyTraitsMixins } from "../traits/entity"
import { IdentityTrait } from "../traits/identity"
import { LabelTrait } from "../traits/label"
import { LocationTrait } from "../traits/location"
import { OwnershipTrait } from "../traits/ownership"
import { ParentArrayTrait } from "../traits/parentArray"

class TopDeckElement extends Schema {}
defineTypes(TopDeckElement, getAllChildrensTypes())

@canBeChild
@containsChildren(false)
@applyTraitsMixins([
  IdentityTrait,
  LocationTrait,
  ChildTrait,
  ParentArrayTrait,
  LabelTrait,
  OwnershipTrait,
])
export class Deck extends Entity<DeckOptions> {
  @type("uint16") childCount: number

  @type(TopDeckElement) topDeck: TopDeckElement

  create(state: State, options: DeckOptions = {}) {
    this.name = def(options.name, "Deck")
    this.type = def(options.type, "deck")

    this.childCount = 0
    this.topDeck = new TopDeckElement()

    this.childAdded = (child: ChildTrait) => {
      this.childCount++
      this.updateTopElement(child)
    }
    this.childRemoved = (idx: number) => {
      this.childCount--
      this.updateTopElement(this.getTop())
    }
  }

  updateTopElement(child: { [key: string]: any }) {
    const whitelist = Object.keys(getAllChildrensTypes())

    whitelist.forEach((key) => {
      this.topDeck[key] = child[key]
    })
  }
}

interface Mixin
  extends IdentityTrait,
    LocationTrait,
    ChildTrait,
    ParentArrayTrait,
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
