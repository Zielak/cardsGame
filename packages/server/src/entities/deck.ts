import { def } from "@cardsgame/utils"
import { Schema } from "@colyseus/schema"

import { canBeChild } from "../annotations/canBeChild.js"
import { containsChildren } from "../annotations/containsChildren.js"
import { globalEntitiesContext } from "../annotations/entitiesContext.js"
import { defineTypes, type } from "../annotations/type.js"
import type { State } from "../state/state.js"
import { ChildTrait } from "../traits/child.js"
import { applyTraitsMixins, Entity } from "../traits/entity.js"
import { IdentityTrait } from "../traits/identity.js"
import { LabelTrait } from "../traits/label.js"
import { LocationTrait } from "../traits/location.js"
import { OwnershipTrait } from "../traits/ownership.js"
import { ParentTrait } from "../traits/parent.js"

class TopDeckElement extends Schema {}

const typesMap = {}
globalEntitiesContext.allChildrensTypes.forEach(
  (value, key) => (typesMap[key] = value)
)
defineTypes(TopDeckElement, typesMap)

interface TopDeckElement {
  [key: string]: any
}

/**
 * Deck of cards, or stack of any entities.
 *
 * Only the topmost entity can be visible in this container, via `topDeck` property.
 *
 * @category Entity
 */
@canBeChild
@containsChildren
@applyTraitsMixins([
  IdentityTrait,
  LocationTrait,
  ChildTrait,
  ParentTrait,
  LabelTrait,
  OwnershipTrait,
])
export class Deck extends Entity<DeckOptions> {
  /**
   * Number of child elements synchronized to the client.
   * @category Deck
   */
  @type("uint16") childCount: number

  /**
   * @category Deck
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
      Object.keys(this.topDeck).forEach((key) => {
        this.topDeck[key] =
          typeof this.topDeck[key] === "number" ? 0 : undefined
      })
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
    ParentTrait,
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
