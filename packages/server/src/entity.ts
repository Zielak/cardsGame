import { nosync } from "colyseus"
import { EventEmitter } from "eventemitter3"

import {
  def,
  EntityEvents,
  EntityTransformData,
  StateEvents
} from "@cardsgame/utils"
import { EntityMap } from "./entityMap"
import { State } from "./state"
import { Player } from "./player"
import { EntityTransform } from "./transform"
import { logs } from "./logs"
import { VisibilityData } from "./visibilityData"
import { condvis } from "./decorators"

export class Entity extends EventEmitter {
  @nosync
  _visibilityData: VisibilityData

  @nosync
  _state: State

  // @condvis
  id: EntityID
  idx: number

  children = new EntityMap<Entity>()

  // Will always point to some Entity, can point to `state.entities`
  parent: EntityID

  @nosync
  hijacksInteractionTarget: boolean = false

  visibleToPublic: boolean

  isContainer = false
  type: string
  name: string
  @condvis
  selected: boolean

  width: number
  height: number

  // Transform data applied
  x: number
  y: number
  angle: number

  // quote: Current transform of the object based on local factors
  // eg. author-chosen transform when creating this entity
  @nosync
  _localTransform: EntityTransform

  // quote: Current transform of the object based on world (parent) factors
  // eg. transform applied by parent container
  @nosync
  _worldTransform: EntityTransform

  constructor(options: IEntityOptions) {
    super()

    // state && id
    this._state = options.state
    this.id = this._state.rememberEntity(this)
    this._visibilityData = new VisibilityData()

    this._visibilityData.add(
      "selected",
      // it's always player's private bussiness
      /* toEveryone */ () => false,
      /* toOwner */ () => true
    )

    // transform
    this._localTransform = new EntityTransform(
      options.x,
      options.y,
      options.angle
    )
    this._localTransform.on("update", () => this.updateTransform())
    this._worldTransform = new EntityTransform()
    this._worldTransform.on("update", () => this.updateTransform())
    this.updateTransform()

    // element data stuff
    this.type = def(options.type, Entity.DEFAULT_TYPE)
    this.name = def(options.name, Entity.DEFAULT_NAME)
    this.visibleToPublic = true

    // parent
    if (this._state.entities) {
      if (!options.parent) {
        // no parent = root as parent
        // this.parent = State.ROOT_ID
        this._state.entities.addChild(this)
      } else {
        const newParent =
          typeof options.parent === "number"
            ? this._state.getEntity(options.parent)
            : options.parent
        newParent.addChild(this)
      }
    } else {
      // It must be the root!
      if (this.id !== State.ROOT_ID) {
        // IT ISN'T!!!
        throw new Error(`Shouldn't happen. Root doesn't have root's ID?`)
      } else {
        this.parent = null
      }
    }

    this.setupListeners()
  }

  protected setupListeners() {
    this.on(EntityEvents.childAdded, (child: Entity) => {
      this.onChildAdded(child)
      this.restyleChildren()
    })

    this.on(EntityEvents.childRemoved, (childID: EntityID) => {
      this.onChildRemoved(childID)
      this.restyleChildren()
    })

    // Rare case, when entityMap's self check finds inconsistency.
    this.on(EntityEvents.idxUpdate, (idx: number) => {
      this.idx = idx
    })

    this.on(EntityEvents.ownerUpdate, (event: EOwnerUpdate) => {
      this.sendAllPrivateAttributes()
    })

    this.on(EntityEvents.parentUpdate, (event: EParentUpdate) => {
      // Need to update even if owner stayed the same.
      // Client will create entirely new container
      if (event.lastParent) {
        event.lastParent.emit(StateEvents.privatePropsSyncRequest)
      }
      this.parentEntity.emit(StateEvents.privatePropsSyncRequest)
    })

    this.on(EntityEvents.sendPropToEveryone, (key: string) => {
      this._sendPrivAttrUpdate(key, true)
    })
    this.on(EntityEvents.sendPropToOwner, (key: string) => {
      this._sendPrivAttrUpdate(key, false)
    })

    this.on(StateEvents.privatePropsSyncRequest, (client: string) => {
      this.sendAllPrivateAttributes(client)
      this.childrenArray.forEach(child => {
        child.emit(StateEvents.privatePropsSyncRequest, client)
      })
    })
  }

  /**
   * Send out all private attributes, depending on their "privacy state"
   *
   * @param {string} [client] - if defined, will send private stuff only to this client if he owns this element (prevents too much updates)
   */
  sendAllPrivateAttributes(client?: string) {
    // logs.info('sendAllPrivateAttributes', client)
    this._visibilityData.keys.forEach(key => {
      if (this._visibilityData.shouldSendToEveryone(key)) {
        this._sendPrivAttrUpdate(key, true)
      } else if (this._visibilityData.shouldSendToOwner(key)) {
        if (!client || (this.owner && this.owner.clientID === client)) {
          this._sendPrivAttrUpdate(key, false)
        }
      }
    })
  }

  _sendPrivAttrUpdate(key: string, _public: boolean) {
    // logs.log('_sendPrivAttrUpdate', _public ? 'public' : 'owner', key)
    const event: PrivateAttributeChangeData = {
      path: this.idxPath,
      owner: this.owner && this.owner.clientID,
      public: _public,
      attribute: key,
      value: this[key]
    }
    this._state.emit(EntityEvents.privateAttributeChange, event)
  }

  addChild(child: Entity) {
    if (child === this) {
      throw new Error(`adding itself as a child makes no sense.`)
    }
    if (this.childrenArray.some(el => el === child)) {
      logs.verbose(`Child is already here`, child.idxPath)
      return
    }

    const lastParent: Entity =
      child.parent === State.ROOT_ID || !child.parent
        ? null
        : child.parentEntity
    const lastOwner = child.owner

    if (lastParent) {
      // Remember to remove myself from first parent
      lastParent.removeChild(child.id, true)
    }

    const idx = this.children.add(child)
    child.parent = this.id
    child.idx = idx

    const event: EParentUpdate = {
      entity: child,
      lastParent
    }

    // Also emit owner update if that happened
    if (
      child.owner !== lastOwner &&
      child.owner !== null &&
      lastOwner !== null
    ) {
      logs.warn("child.owner", child.owner)
      const event: EOwnerUpdate = {
        entity: child,
        previousOwner: lastOwner.clientID,
        currentOwner: child.owner.clientID
      }
      this.emit(EntityEvents.ownerUpdate, event)
    }
    this.emit(EntityEvents.childAdded, child)
    child.emit(EntityEvents.parentUpdate, event)
  }

  addChildren(children: Entity[]) {
    children.forEach(newChild => {
      this.addChild(newChild)
    })
  }

  // TODO:
  addChildAt(newChild: Entity, idx: number) {}

  removeChild(id: EntityID, _silent: boolean = false): boolean {
    const idx = this.childrenArray.findIndex(child => {
      return child.id === id
    })
    return this.removeChildAt(idx, _silent)
  }

  removeChildAt(idx: number, _silent: boolean = false): boolean {
    const child: Entity = this.children[idx]
    const result = this.children.remove(idx)
    if (!result) {
      return false
    }
    const lastParent: Entity = child.parentEntity
    child.parent = State.ROOT_ID
    // Reset last parent's stylings
    child.resetWorldTransform()

    if (!_silent) {
      const event: EParentUpdate = {
        entity: child,
        lastParent
      }
      child.emit(EntityEvents.parentUpdate, event)
    }
    this.emit(EntityEvents.childRemoved, child.id)
    return true
  }

  onChildAdded(child: Entity) {}
  onChildRemoved(childID: EntityID) {}

  restyleChildren() {
    this.childrenArray.forEach(
      (child: Entity, idx: number, array: Entity[]) => {
        const data = this.restyleChild(child, idx, array)
        if (data.x) child._worldTransform.x = data.x
        if (data.y) child._worldTransform.y = data.y
        if (data.angle) child._worldTransform.angle = data.angle
        child.updateTransform()
      },
      this
    )
  }

  /**
   * Override in each container-like entity
   */
  restyleChild(
    child: Entity,
    idx: number,
    children: Entity[]
  ): EntityTransformData {
    return {
      x: 0,
      y: 0,
      angle: 0
    }
  }

  updateTransform() {
    ;["x", "y", "angle"].map(prop => {
      this[prop] = this._localTransform[prop] + this._worldTransform[prop]
    })
  }

  resetWorldTransform() {
    ;["x", "y", "angle"].map(prop => {
      this._worldTransform[prop] = 0
    })
  }

  filterByName(name: string) {
    return this.childrenArray.filter(EntityMap.byName(name))
  }
  findByName(name: string) {
    return this.childrenArray.find(EntityMap.byName(name))
  }
  filterByType(type: string) {
    return this.childrenArray.filter(EntityMap.byType(type))
  }
  findByType(type: string) {
    return this.childrenArray.find(EntityMap.byType(type))
  }

  /**
   * Get the element with highest 'idx' value
   */
  get top(): Entity {
    return this.children[this.length - 1]
  }

  /**
   * Get the element with the lowest 'idx' value
   */
  get bottom(): Entity {
    return this.children[0]
  }

  /**
   * Number of child elements
   */
  get length(): number {
    return Object.keys(this.children).length
  }

  /**
   * Points out if this element can be
   * target of any interaction
   */
  get interactive(): boolean {
    const parent = this.parentEntity
    if (parent.hijacksInteractionTarget) {
      return false
    }
    return true
  }

  /**
   * Gets all children in array form, "sorted" by idx
   */
  get childrenArray(): Entity[] {
    return this.children.toArray()
  }

  /**
   * Gets a reference to this entity's parent.
   * There must be any parent, so any null will fallback to state's `entities`
   */
  get parentEntity(): Entity {
    const parent = this._state.getEntity(this.parent)
    return parent || this._state.entities
  }

  /**
   * Get the real owner of this container, by traversing `this.parent` chain.
   *
   * @returns `Player` or `null` if this container doesn't belong to anyone
   */
  get owner(): Player {
    if (this.parent === State.ROOT_ID || this.parent === null) {
      return null
    }
    if (this.parentEntity.type === "player") {
      return this.parentEntity as Player
    }
    return this.parentEntity.owner
  }

  get idxPath(): number[] {
    const path: number[] = [this.idx]
    const getNext = (entity: Entity) => {
      const parentsIdx = entity.parentEntity.idx
      if (
        entity.parentEntity instanceof Entity &&
        typeof parentsIdx === "number"
      ) {
        path.unshift(parentsIdx)
        getNext(entity.parentEntity)
      }
    }
    getNext(this)

    return path
  }

  static DEFAULT_NAME = "Unnamed"
  static DEFAULT_TYPE = "Entity"
}

// Get rid of EventEmitter stuff from the client
nosync(Entity.prototype, "_events")
nosync(Entity.prototype, "_eventsCount")
nosync(Entity.prototype, "_maxListeners")
nosync(Entity.prototype, "domain")

export interface IEntityOptions {
  state: State
  type?: string
  name?: string
  width?: number
  height?: number
  x?: number
  y?: number
  angle?: number
  parent?: EntityID | Entity
  idx?: number
}

export type EParentUpdate = {
  entity: Entity
  lastParent: Entity
}

export type EOwnerUpdate = {
  previousOwner: string
  currentOwner: string
  entity: Entity
}
