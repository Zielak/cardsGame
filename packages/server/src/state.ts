import { Schema, type, MapSchema } from "@colyseus/schema"
import { logs } from "./logs"
import { IEntity, getOwner } from "./entities/traits/entity"
import { cm2px, mapCount } from "@cardsgame/utils"
import { Children } from "./children"
import { IParent } from "./entities/traits/parent"
import { Player } from "./player"

// TODO: some query functions to help finding game objects
// - by name
// - of owner, by name
// - by type

export class State extends Schema {
  @type("number")
  tableWidth = cm2px(60) // 60 cm

  @type("number")
  tableHeight = cm2px(60) // 60 cm

  @type(Children)
  entities = new Children()

  @type({ map: Player })
  players = new MapSchema<Player>()

  @type({ map: "string" })
  clients = new MapSchema<string>()

  @type("uint8")
  currentPlayerIdx: number

  get currentPlayer(): Player {
    return this.players[this.currentPlayerIdx]
  }
  get playersCount(): number {
    return mapCount(this.players)
  }

  // TODO: think this through:
  // gameVariants: any

  @type("boolean")
  isGameStarted = false

  @type({ map: "string" })
  ui: StateUI = new MapSchema<string>()

  _lastID = -1
  _allEntities = new Map<number, IEntity>()

  // constructor(options?: IStateOptions) {
  //   super()
  //   // TODO: do something with these options.
  //   this.setupListeners()
  // }

  /**
   * @deprecated? instead of this, provide users with factory functions, which would register entities automatically
   * Registers new entity to the gamestate
   * @param entity
   * @returns new ID to be assigned to that entity
   */
  registerEntity(entity: IEntity) {
    const newID = ++this._lastID
    this._allEntities.set(newID, entity)
    return newID
  }

  /**
   * Get an Entity by its ID
   * @param id
   */
  getEntity(id: EntityID): IEntity
  /**
   * Get an Entity by its idx path
   * @param path
   */
  getEntity(path: number[]): IEntity
  getEntity(idOrPath: EntityID | number[]): IEntity {
    if (Array.isArray(idOrPath)) {
      const travel = (children: Children, remainingPath: number[]) => {
        const idx = remainingPath.shift()
        const newChild = children.get(idx) as IParent
        if (!newChild) {
          throw new Error(
            `getEntity/path: This entity doesn't have such child.`
          )
        }
        if (remainingPath.length > 0 && !newChild["_children"]) {
          throw new Error(
            `getEntity/path: Path inaccessible, entity doesn't have any children. Stopped at [${remainingPath}].`
          )
        }
        if (remainingPath.length > 0) {
          return travel(newChild._children, remainingPath)
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
  getEntitiesAlongPath(path: number[]): IEntity[] {
    const travel = (
      children: Children,
      remainingPath: number[],
      result: IEntity[] = []
    ) => {
      const idx = remainingPath.shift()
      const newChild = children.get(idx) as IParent
      if (!newChild) {
        throw new Error(
          `getEntitiesAlongPath: This entity doesn't have such child.`
        )
      }
      if (remainingPath.length > 0 && !newChild["_children"]) {
        throw new Error(
          `getEntitiesAlongPath: Path inaccessible, entity doesn't have any children. Stopped at [${path}].`
        )
      }

      result.push(newChild)
      if (remainingPath.length > 0) {
        return travel(newChild._children, remainingPath, result)
      } else {
        return result
      }
    }
    return travel(this.entities, [...path])
  }

  logTreeState(startingPoint?: IEntity) {
    logs.log("")
    const indent = (level: number) => {
      return "│ ".repeat(level)
    }
    const travel = (children: Children, level: number = 0) => {
      children.toArray().map((child, idx, entities) => {
        if (
          // getParentEntity(child).isContainer && // Parent HAS to be a container...
          entities.length > 5 &&
          idx < entities.length - 5
        ) {
          // That's too much, man!
          if (idx === 0) {
            logs.log(`${indent(level)}`, "...")
          }
          return
        }

        const asParent = child as IParent

        const owner = getOwner(child)

        const lastChild = entities.length - 1 === idx
        const sIdx = idx === child.idx ? `${idx}` : `e${child.idx}:s${idx}`

        const sChildren =
          asParent._children && asParent._children.length > 0
            ? asParent._children.length + " children"
            : ""
        const sOwner = owner ? `(${owner.name} ${owner.clientID})` : ""
        const branchSymbol = lastChild ? "┕━" : "┝━"

        logs.log(
          `${indent(level)}${branchSymbol}[${sIdx}]`,
          `${child.type}:${child.name}-[${child.idx}]`,
          sChildren,
          sOwner
        )
        if (asParent._children && asParent._children.length > 0) {
          travel(asParent._children, level + 1)
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
  tableWidth?: number
  tableHeight?: number
}
