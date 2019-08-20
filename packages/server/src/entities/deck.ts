import { IEntity, IEntityOptions, EntityConstructor } from "../traits/entity"
import { Schema, type } from "@colyseus/schema"
import {
  IParent,
  containsChildren,
  ParentConstructor,
  canBeChild
} from "../traits/parent"
import { State } from "../state"
import { Player } from "../player"
import { emitsEvents, IEventEmitter, EmitterConstructor } from "../traits"

@canBeChild
@containsChildren(false)
@emitsEvents
export class Deck extends Schema implements IEntity, IParent, IEventEmitter {
  // IEntity
  _state: State
  id: EntityID
  owner: Player
  parent: EntityID
  isParent(): this is IParent {
    return true
  }

  @type("string")
  ownerID: string

  @type("boolean")
  isInOwnersView: boolean

  @type("uint8")
  idx: number

  @type("string")
  type = "deck"
  @type("string")
  name = "Deck"

  @type("number")
  x: number
  @type("number")
  y: number
  @type("number")
  angle: number

  // IParent
  _childrenPointers: string[]
  hijacksInteractionTarget = true

  // IEventEmitter
  on: (event: string | symbol, listener: (...args: any[]) => void) => this
  once: (event: string | symbol, listener: (...args: any[]) => void) => this
  off: (event: string | symbol, listener: (...args: any[]) => void) => this
  emit: (event: string | symbol, ...args: any[]) => boolean

  static events = {
    childAdded: Symbol("childAdded"),
    childRemoved: Symbol("childRemoved"),
    emptied: Symbol("emptied")
  }

  // ================

  @type("uint16")
  childCount: number = 0

  // TODO: deck may display its topmost card, if it's `faceUp`

  onChildAdded(child: IEntity) {
    this.childCount++
    this.emit(Deck.events.childAdded, child)
  }
  onChildRemoved(idx: number) {
    this.childCount--
    this.emit(Deck.events.childRemoved, idx)
    if (this.childCount === 0) {
      this.emit(Deck.events.emptied)
    }
  }

  constructor(options: IEntityOptions) {
    super()
    EmitterConstructor(this)
    ParentConstructor(this)
    EntityConstructor(this, options)
  }
}
