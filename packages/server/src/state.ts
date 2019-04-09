import { Schema, type, MapSchema } from "@colyseus/schema"
import { default as EEmitter, EventEmitter } from "eventemitter3"
import { logs } from "./logs"
import { Entity } from "./entities/entity"
import { cm2px } from "@cardsgame/utils"
import { EntityMap } from "./entityMap"

class PlayerData extends Schema {
  @type("uint16")
  entityID: EntityID

  @type("string")
  clientID: string
}

export interface IState {
  entities: EntityMap
  getEntity(id: EntityID): Entity
  getEntity(path: number[]): Entity
  getEntitiesAlongPath(path: number[]): Entity[]
  rememberEntity(entity: Entity)
  logTreeState(startingPoint?: Entity)
  // on: (
  //   event: string | symbol,
  //   fn: EEmitter.ListenerFn,
  //   context?: any
  // ) => EEmitter<string | symbol>
  // once: (
  //   event: string | symbol,
  //   fn: EEmitter.ListenerFn,
  //   context?: any
  // ) => EEmitter<string | symbol>
  // off: (
  //   event: string | symbol,
  //   fn?: EEmitter.ListenerFn,
  //   context?: any,
  //   once?: boolean
  // ) => EEmitter<string | symbol>
  // emit: (event: string | symbol, ...args: any[]) => boolean
}

export class State extends Schema implements IState {
  @type("number")
  tableWidth = cm2px(60) // 60 cm

  @type("number")
  tableHeight = cm2px(60) // 60 cm

  @type(EntityMap)
  entities = new EntityMap()

  @type({ map: PlayerData })
  players = new MapSchema<PlayerData>()

  @type({ map: "string" })
  clients = new MapSchema<string>()

  @type("uint8")
  currentPlayerIdx: number

  get currentPlayer(): PlayerData {
    return this.players[this.currentPlayerIdx]
  }
  get playersCount(): number {
    return this.players.length
  }

  // TODO: think this through:
  // gameVariants: any

  @type("boolean")
  isGameStarted = false

  @type({ map: "string" })
  ui: StateUI = new MapSchema<string>()

  _emitter: EEmitter
  // on: (
  //   event: string | symbol,
  //   fn: EEmitter.ListenerFn,
  //   context?: any
  // ) => EEmitter<string | symbol>
  // once: (
  //   event: string | symbol,
  //   fn: EEmitter.ListenerFn,
  //   context?: any
  // ) => EEmitter<string | symbol>
  // off: (
  //   event: string | symbol,
  //   fn?: EEmitter.ListenerFn,
  //   context?: any,
  //   once?: boolean
  // ) => EEmitter<string | symbol>
  // emit: (event: string | symbol, ...args: any[]) => boolean

  _lastID = -1
  _allEntities = new Map<number, Entity>()

  constructor(options?: IStateOptions) {
    super()
    // TODO: do something with these options.
    this.entities[0] = new Entity({
      state: this,
      type: "root",
      name: "root"
    })

    // this._emitter = new EventEmitter()
    // this.on = this._emitter.on.bind(this._emitter)
    // this.once = this._emitter.once.bind(this._emitter)
    // this.off = this._emitter.off.bind(this._emitter)
    // this.emit = this._emitter.emit.bind(this._emitter)

    this.setupListeners()
  }

  setupListeners() {
    // this.on(State.events.privatePropsSyncRequest, (client: string) => {
    //   // Bubble it down to every entity
    //   logs.info("State.privatePropsSyncRequest")
    //   this.entities.emit(State.events.privatePropsSyncRequest, client)
    // })
  }

  /**
   * @deprecated instead of this, provide users with factory functions, which would register entities automatically
   * Registers new entity to the gamestate
   * @param entity
   * @returns new ID to be assigned to that entity
   */
  rememberEntity(entity: Entity) {
    const newID = ++this._lastID
    this._allEntities.set(newID, entity)
    return newID
  }

  /**
   * Get an Entity by its ID
   * @param id
   */
  getEntity(id: EntityID): Entity
  /**
   * Get an Entity by its idx path
   * @param path
   */
  getEntity(path: number[]): Entity
  getEntity(idOrPath: EntityID | number[]): Entity {
    if (Array.isArray(idOrPath)) {
      const travel = (entity: Entity, path: number[]) => {
        const idx = path.shift()
        const newChild = entity.children[idx] as Entity
        if (!newChild) {
          logs.error("getEntity/path", `This entity doesn't have such child`)
        }
        if (path.length > 0) {
          return travel(newChild, path)
        } else {
          return newChild
        }
      }
      return travel(this.entities[0], [...idOrPath])
    }
    return this._allEntities.get(idOrPath)
  }

  /**
   * Gets an array of all entities from the top-most parent
   * to the lowest of the child.
   */
  getEntitiesAlongPath(path: number[]): Entity[] {
    const travel = (entity: Entity, path: number[], result: Entity[] = []) => {
      const idx = path.shift()
      const newChild = entity.children[idx] as Entity
      if (!newChild) {
        logs.error("getEntity/path", `This entity doesn't have such child`)
      }
      result.push(newChild)
      if (path.length > 0) {
        return travel(newChild, path, result)
      } else {
        return result
      }
    }
    return travel(this.entities[0], [...path])
  }

  logTreeState(startingPoint?: Entity) {
    logs.log("")
    const indent = (level: number) => {
      return "│ ".repeat(level)
    }
    const travel = (entity: Entity, level: number = 0) => {
      entity.childrenArray.map((child, idx, entities) => {
        if (
          child.parentEntity.isContainer &&
          entities.length > 5 &&
          idx < entities.length - 5
        ) {
          // That's too much, man!
          if (idx === 0) {
            logs.log(`${indent(level)}`, "...")
          }
          return
        }

        const owner = child.owner

        const lastChild = entities.length - 1 === idx
        const sIdx = idx === child.idx ? `${idx}` : `e${child.idx}:s${idx}`
        const sVisibility = child.visibleToPublic ? "Pub" : ""

        const sChildren = child.length > 0 ? child.length + " children" : ""
        const sOwner = owner ? `(${owner.type} ${owner.clientID})` : ""
        const branchSymbol = lastChild ? "┕━" : "┝━"

        logs.log(
          `${indent(level)}${branchSymbol}[${sIdx}]${sVisibility}`,
          `${child.type}:${child.name}-[${child.idx}]`,
          sChildren,
          sOwner
        )
        if (child.length > 0) {
          travel(child, level + 1)
        }
      })
    }
    const root = this.entities[0]
    logs.log(
      `┍━[${root.idx}]`,
      `${root.type}:${root.name}`,
      root.length + "children"
    )
    travel(startingPoint || root, 1)
  }

  static events = {
    privatePropsSyncRequest: Symbol("privatePropsSyncRequest"),
    playerTurnFinished: Symbol("playerTurnFinished"),
    playerTurnStarted: Symbol("playerTurnStarted")
  }
}

export interface StateUI {
  clone: () => MapSchema
  onAdd: (item: any, key: string) => void
  onRemove: (item: any, key: string) => void
  onChange: (item: any, key: string) => void
}

export interface IStateOptions {
  minClients: number
  maxClients: number
  hostID: string
}
