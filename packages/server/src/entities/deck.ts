import { def } from "@cardsgame/utils"
import { Schema } from "@colyseus/schema"

import { canBeChild } from "../annotations/canBeChild"
import { containsChildren } from "../annotations/containsChildren"
import { globalEntitiesContext } from "../annotations/entitiesContext"
import { defineTypes, type } from "../annotations/type"
import { State } from "../state"
import { ChildTrait } from "../traits/child"
import { applyTraitsMixins, Entity } from "../traits/entity"
import { IdentityTrait } from "../traits/identity"
import { LabelTrait } from "../traits/label"
import { LocationTrait } from "../traits/location"
import { OwnershipTrait } from "../traits/ownership"
import { ParentArrayTrait } from "../traits/parentArray"

class TopDeckElement extends Schema {}

const typesMap = {}
globalEntitiesContext.allChildrensTypes.forEach(
  (value, key) => (typesMap[key] = value)
)
defineTypes(TopDeckElement, typesMap)

interface TopDeckElement {
  [key: string]: any
}

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
  /**
   * Number of child elements synchronized to the client.
   * @memberof Deck
   */
  @type("uint16") childCount: number

  /**
   * @memberof Deck
   */
  @type(TopDeckElement) topDeck: TopDeckElement

  create(state: State, options: DeckOptions = {}): void {
    this.name = def(options.name, "Deck")
    this.type = def(options.type, "deck")

    this.childCount = 0
    this.topDeck = new TopDeckElement()

    this.childAdded = (child: ChildTrait): void => {
      this.childCount++
      this.updateTopElement(child)
    }
    this.childRemoved = (idx: number): void => {
      this.childCount--
      this.updateTopElement(this.getTop())
    }
  }

  updateTopElement(child: { [key: string]: any }): void {
    if (!child) {
      Object.keys(this.topDeck).forEach(
        (key) => (this.topDeck[key] = undefined)
      )
    } else {
      globalEntitiesContext.allChildrensTypes.forEach((_, key) => {
        this.topDeck[key] = child[key]
      })
    }
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
  NonFunctionProperties<Mixin> & {
    childCount: number
  }
>

// What I want the entity to actually contain
export interface Deck extends Mixin {}
