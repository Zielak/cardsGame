import { nosync } from "colyseus"
import { EventEmitter } from "eventemitter3"
import { logs } from "./logs"
import { deg2rad, rad2deg, StateEvents } from "@cardsgame/utils"
import { Entity } from "./entity"
import { EntityMap } from "./entityMap"
import { Player } from "./player"

export class State extends EventEmitter {
  // 60 cm
  tableWidth = 600
  // 60 cm
  tableHeight = 600

  entities: Entity

  players = new EntityMap<PlayerData>()
  currentPlayerIdx: number
  get currentPlayer(): PlayerData {
    return this.players[this.currentPlayerIdx]
  }
  get playersCount(): number {
    return this.players.length
  }

  // TODO: think this through:
  gameVariants: any

  isGameStarted = false
  @nosync
  _lastID = -1
  @nosync
  _allEntities = new Map<number, Entity>()

  constructor(options?: IStateOptions) {
    super()
    // TODO: do something with these options.

    this.entities = new Entity({
      state: this,
      type: "root",
      name: "root"
    })

    this.setupListeners()
  }

  setupListeners() {
    this.on(StateEvents.privatePropsSyncRequest, (client: string) => {
      // Bubble it down to every entity
      logs.info("State.privatePropsSyncRequest")
      this.entities.emit(StateEvents.privatePropsSyncRequest, client)
    })
  }

  /**
   * FIXME: that should be client-side code...
   * Player playing the game needs to have his cards visible
   * at HIS pottom of the screen...
   */
  private updatePlayers() {
    this.entities.childrenArray
      .filter((entity: Entity) => entity.type === "player")
      .forEach((player: Player, idx: number, players: Player[]) => {
        const angle = ((Math.PI * 2) / players.length) * idx
        const point = {
          x: Math.sin(angle) * (this.tableWidth * 0.4),
          y: Math.cos(angle) * (this.tableHeight * 0.4)
        }
        player.angle = -rad2deg(angle)
        player.x = point.x
        player.y = point.y
        logs.log(
          "updatePlayers",
          `player[${idx}] angle: ${angle}, point: (${point.x}, ${point.y})`
        )
      })
  }

  /**
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
      return travel(this.entities, [...idOrPath])
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
    return travel(this.entities, [...path])
  }

  logTreeState() {
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
    const root = this.entities
    logs.log(
      `┍━[${root.idx}]`,
      `${root.type}:${root.name}`,
      root.length + "children"
    )
    travel(root, 1)
  }

  static ROOT_ID = 0
}

// Get rid of EventEmitter stuff from the client
nosync(State.prototype, "_events")
nosync(State.prototype, "_eventsCount")
nosync(State.prototype, "_maxListeners")
nosync(State.prototype, "domain")

export interface IStateOptions {
  minClients: number
  maxClients: number
  hostID: string
}

export type PlayerData = {
  entity: Entity
  clientID: string
}
