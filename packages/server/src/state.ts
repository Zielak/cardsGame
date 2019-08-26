import { Schema, type, MapSchema } from "@colyseus/schema"
import { logs } from "@cardsgame/utils"
import { IEntity, getOwner, getIdxPath } from "./traits/entity"
import { cm2px, mapCount } from "@cardsgame/utils"
import {
  IParent,
  ParentConstructor,
  getChild,
  countChildren,
  getChildren,
  getDescendants,
  containsChildren,
  IParentOptions
} from "./traits/parent"
import { Player } from "./player"
import { PlayerViewPosition } from "./playerViewPosition"

const hasChildren = (entity: IEntity | IParent) =>
  entity.isParent() ? countChildren(entity) > 0 : false

@containsChildren()
export class State extends Schema implements IParent {
  // IParent
  id = -1
  _childrenPointers: string[]
  hijacksInteractionTarget = false

  onChildAdded: any
  onChildRemoved: any

  isParent(): this is IParent {
    return true
  }

  // State stuff
  @type("number")
  tableWidth = cm2px(60) // 60 cm

  @type("number")
  tableHeight = cm2px(60) // 60 cm

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
  ui: StateUI = new MapSchema<string | string[]>()

  @type(PlayerViewPosition)
  playerViewPosition = new PlayerViewPosition()

  _lastID = -1
  _allEntities = new Map<number, IEntity>()

  constructor(options?: IStateOptions) {
    super()
    ParentConstructor(this, options)
  }

  /**
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
      const travel = (parent: IParent, remainingPath: number[]) => {
        const idx = remainingPath.shift()
        const newChild = getChild(parent, idx)
        if (!newChild) {
          throw new Error(
            `getEntity/path: This entity doesn't have such child.`
          )
        }
        if (remainingPath.length > 0 && !newChild["_childrenPointers"]) {
          throw new Error(
            `getEntity/path: Path inaccessible, entity doesn't have any children. Stopped at [${remainingPath}].`
          )
        }
        if (remainingPath.length > 0) {
          return travel(newChild as IParent & IEntity, remainingPath)
        } else {
          return newChild
        }
      }
      return travel(this, [...idOrPath])
    }
    if (idOrPath >= 0) {
      return this._allEntities.get(idOrPath)
    }
  }

  /**
   * Gets an array of all entities from the top-most parent
   * to the lowest of the child.
   */
  getEntitiesAlongPath(path: number[]): IEntity[] {
    const travel = (
      parent: IParent,
      remainingPath: number[],
      result: IEntity[] = []
    ) => {
      const idx = remainingPath.shift()
      const newChild = getChild<IParent & IEntity>(parent, idx)
      if (!newChild) {
        throw new Error(
          `getEntitiesAlongPath: This entity doesn't have such child.`
        )
      }
      if (remainingPath.length > 0 && !hasChildren(newChild)) {
        throw new Error(
          `getEntitiesAlongPath: Path inaccessible, entity doesn't have any children. Stopped at [${path}]. Remaining path: [${remainingPath}]`
        )
      }

      result.push(newChild)
      if (remainingPath.length > 0) {
        return travel(newChild, remainingPath, result)
      } else {
        return result
      }
    }
    return travel(this, [...path])
  }

  logTreeState(logger: any = logs, startingPoint?: IParent & IEntity) {
    const travel = (parent: IParent) => {
      getChildren(parent).map((child, idx, entities) => {
        if (
          // getParentEntity(child).isContainer && // Parent HAS to be a container...
          entities.length > 60 &&
          idx < entities.length - 60
        ) {
          // That's too much, man!
          if (idx === 0) {
            logger.notice("...")
          }
          return
        }

        const owner = getOwner(child)

        // const lastChild = entities.length - 1 === idx
        const sIdx = idx === child.idx ? `${idx}` : `e${child.idx}:s${idx}`
        const idxPath = getIdxPath(child)

        const childrenCount = countChildren(child as IParent & IEntity)
        const sChildren = childrenCount > 0 ? childrenCount : ""
        const sOwner = owner ? `(${owner.name} ${owner.clientID})` : ""
        // const branchSymbol = lastChild ? "┕━" : "┝━"

        const hasChildren = child.isParent() && childrenCount > 0

        logger[hasChildren ? "group" : "notice"](
          `[${idxPath}]`,
          `${child.type}:${child.name}-[${child.idx}]`,
          sChildren,
          sOwner
        )
        if (child.isParent() && childrenCount > 0) {
          travel(child)
          logger.groupEnd()
        }
      })
    }

    if (!startingPoint) {
      logger.group(
        "ROOT",
        "(" + countChildren(this) + " direct children,",
        getDescendants(this).length,
        "in total)"
      )
    } else {
      logger.group(
        `[${startingPoint.idx}] ${startingPoint.type}:${startingPoint.name}`,
        countChildren(startingPoint) + "children"
      )
    }
    travel(startingPoint || this)
    logger.groupEnd()
  }

  static events = {
    playerTurnStarted: Symbol("playerTurnStarted"),
    playerTurnEnded: Symbol("playerTurnEnded")
  }
}

export interface StateUI {
  clone: () => MapSchema
  onAdd: (item: any, key: string) => void
  onRemove: (item: any, key: string) => void
  onChange: (item: any, key: string) => void
}

export interface IStateOptions extends IParentOptions {
  minClients: number
  maxClients: number
  hostID: string
  tableWidth?: number
  tableHeight?: number
}
