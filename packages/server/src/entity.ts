import { Schema, type, MapSchema } from "@colyseus/schema"
import { nosync } from "colyseus"
import { default as EEmitter, EventEmitter } from "eventemitter3"

import { def, EntityEvents, EntityTransformData } from "@cardsgame/utils"

import { IState } from "./state"
import { Player } from "./player"
import { EntityTransform } from "./transform"
import { logs } from "./logs"

export class Entity extends Schema {
  // @type("uint16")
  @nosync
  id: EntityID

  // Will always point to some Entity, can point to `state.entities`
  @type("uint16")
  parent: EntityID

  @type("boolean")
  visibleToPublic: boolean

  @type("boolean")
  isContainer = false
  @type("string")
  type: string
  @type("string")
  name: string

  @type("number")
  width: number
  @type("number")
  height: number

  // Transform data applied
  @type("number")
  x: number
  @type("number")
  y: number
  @type("number")
  angle: number

  // ----------------------------------
  // MapSchema management
  @type({ map: Entity })
  children = new MapSchema<Entity>()

  @type("uint16")
  idx: number

  // ----------------------------------
  // Private vars

  @nosync
  _emitter: EEmitter
  @nosync
  on: (
    event: string | symbol,
    fn: EEmitter.ListenerFn,
    context?: any
  ) => EEmitter<string | symbol>
  @nosync
  once: (
    event: string | symbol,
    fn: EEmitter.ListenerFn,
    context?: any
  ) => EEmitter<string | symbol>
  @nosync
  off: (
    event: string | symbol,
    fn?: EEmitter.ListenerFn,
    context?: any,
    once?: boolean
  ) => EEmitter<string | symbol>
  @nosync
  emit: (event: string | symbol, ...args: any[]) => boolean

  @nosync
  _state: IState
  @nosync
  hijacksInteractionTarget: boolean = false

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

    // Prepare emitter
    this._emitter = new EventEmitter()
    this.on = this._emitter.on.bind(this._emitter)
    this.once = this._emitter.once.bind(this._emitter)
    this.off = this._emitter.off.bind(this._emitter)
    this.emit = this._emitter.emit.bind(this._emitter)

    // state && id
    this._state = options.state
    this.id = this._state.rememberEntity(this)

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
    if (this._state.entities[0]) {
      if (!options.parent) {
        // no parent = root as parent
        // this.parent = 0
        this._state.entities[0].addChild(this)
      } else {
        const newParent =
          typeof options.parent === "number"
            ? this._state.getEntity(options.parent)
            : options.parent
        newParent.addChild(this)
      }
    } else {
      // It must be the root!
      if (this.id !== 0) {
        // IT ISN'T!!!
        throw new Error(`Shouldn't happen. Root doesn't have root's ID?`)
      } else {
        this.parent = undefined
      }
    }

    this.setupListeners()
  }

  protected setupListeners() {
    this.on(EntityEvents.childAdded, () => this.restyleChildren())
    this.on(EntityEvents.childRemoved, () => this.restyleChildren())

    // Rare case, when entityMap's self check finds inconsistency.
    this.on(EntityEvents.idxUpdate, (idx: number) => {
      logs.verbose(`Entity.idxUpdate:`, this.idx, `=>`, idx)
      this.idx = idx
    })

    // this.on(EntityEvents.parentUpdate, (event: EParentUpdate) => {
    //   // Need to update even if owner stayed the same.
    //   // Client will create entirely new container
    //   if (event.lastParent) {
    //     event.lastParent.emit(State.events.privatePropsSyncRequest)
    //   }
    //   this.parentEntity.emit(State.events.privatePropsSyncRequest)
    // })
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
      typeof child.parent !== "number" ? undefined : child.parentEntity
    const lastOwner = child.owner

    if (lastParent) {
      // Remember to remove myself from first parent
      lastParent.removeChild(child.id, true)
    }

    const idx = this.length
    this.children[idx] = child
    child.idx = idx
    child.parent = this.id

    const event: EParentUpdate = {
      entity: child,
      lastParent
    }

    // Also emit owner update if that happened
    if (
      child.owner !== lastOwner &&
      child.owner !== undefined &&
      lastOwner !== undefined
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
    const idx = this.childrenArray.findIndex(child => child.id === id)
    return this.removeChildAt(idx, _silent)
  }

  removeChildAt(idx: number, _silent: boolean = false): boolean {
    if (idx < 0)
      throw new Error(`Entity.removeChildAt - idx must be >= 0, but is ${idx}`)
    if (idx > this.length - 1) {
      logs.warn(
        "Entity.removeChildAt()",
        `Tried to remove idx out of bounds:`,
        idx,
        "/",
        this.length
      )
    }
    const child: Entity = this.children[idx]
    const lastParent: Entity = child.parentEntity

    delete this.children[idx]

    child.parent = 0
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

  restyleChildren() {
    this.childrenArray.forEach(
      (child: Entity, idx: number, array: Entity[]) => {
        const data = this.restyleChild(child, idx, array)
        if (data.x) {
          child._worldTransform.x = data.x
        }
        if (data.y) {
          child._worldTransform.y = data.y
        }
        if (data.angle) {
          child._worldTransform.angle = data.angle
        }
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
    return ["x", "y", "angle"].map(prop => {
      this[prop] = this._localTransform[prop] + this._worldTransform[prop]
    })
  }

  resetWorldTransform() {
    return ["x", "y", "angle"].map(prop => {
      this._worldTransform[prop] = 0
    })
  }

  filterByName(name: string) {
    return this.childrenArray.filter(byName(name))
  }
  findByName(name: string) {
    return this.childrenArray.find(byName(name))
  }
  filterByType(type: string) {
    return this.childrenArray.filter(byType(type))
  }
  findByType(type: string) {
    return this.childrenArray.find(byType(type))
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
   * Gets all children in array form, "sorted" by idx
   */
  get childrenArray(): Entity[] {
    return Object.keys(this.children).map(key => this.children[key])
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
   * Gets a reference to this entity's parent.
   * There must be any parent, so any undefined will fallback to state's `entities`
   */
  get parentEntity(): Entity {
    const parent = this._state.getEntity(this.parent)
    return parent || this._state.entities[0]
  }

  /**
   * Get the real owner of this container, by traversing `this.parent` chain.
   *
   * @returns `Player` or `undefined` if this container doesn't belong to anyone
   */
  get owner(): Player {
    if (this.parent === 0 || this.parent === undefined) {
      return undefined
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

  // ----------------------------------
  // Static

  static DEFAULT_NAME = "Unnamed"
  static DEFAULT_TYPE = "Entity"
}

const byName = (name: string) => (entity: Entity): boolean =>
  entity.name === name

const byType = (type: string) => (entity: Entity): boolean =>
  entity.type === type

// Get rid of EventEmitter stuff from the client
// nosync(Entity.prototype, "_events")
// nosync(Entity.prototype, "_eventsCount")
// nosync(Entity.prototype, "_maxListeners")
// nosync(Entity.prototype, "domain")

export interface IEntityOptions {
  state: IState
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
