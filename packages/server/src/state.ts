import { type, MapSchema } from "@colyseus/schema"
import { logs } from "@cardsgame/utils"
import { cm2px, mapCount } from "@cardsgame/utils"
import {
  getChild,
  countChildren,
  getChildren,
  getDescendants,
  containsChildren,
  isParent,
  ParentTrait
} from "./traits/parent"
import { Player } from "./player"
import { PlayerViewPosition } from "./playerViewPosition"
import {
  Entity,
  LabelTrait,
  hasIdentity,
  applyMixins,
  IdentityTrait
} from "./traits"
import { getOwner } from "./traits/ownership"
import { getIdxPath, ChildTrait, isChild } from "./traits/child"

@containsChildren()
export class State extends Entity<any> {
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
  _allEntities = new Map<number, IdentityTrait>()

  constructor(options?: StateOptions) {
    super(undefined, options)

    this.id = -1
    this.hijacksInteractionTarget = false
  }

  /**
   * Registers new entity to the gamestate
   * @param entity
   * @returns new ID to be assigned to that entity
   */
  registerEntity(entity) {
    const newID = ++this._lastID
    this._allEntities.set(newID, entity)
    return newID
  }

  /**
   * Get an Entity by its ID
   * @param id
   */
  getEntity(id: EntityID)
  /**
   * Get an Entity by its idx path
   * @param path
   */
  getEntity(path: number[])
  getEntity(idOrPath: EntityID | number[]) {
    if (Array.isArray(idOrPath)) {
      const travel = (parent: ParentTrait, remainingPath: number[]) => {
        const idx = remainingPath.shift()
        const newChild = getChild(parent, idx)
        if (!newChild) {
          throw new Error(
            `getEntity/path: This entity doesn't have such child.`
          )
        }
        if (remainingPath.length > 0 && !isParent(newChild)) {
          throw new Error(
            `getEntity/path: Path inaccessible, entity doesn't have any children. Stopped at [${remainingPath}].`
          )
        }
        if (remainingPath.length > 0 && isParent(newChild)) {
          return travel(newChild, remainingPath)
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
  getEntitiesAlongPath(path: number[]): IdentityTrait[] {
    const travel = (
      parent: ParentTrait,
      remainingPath: number[],
      result: any[] = []
    ) => {
      const idx = remainingPath.shift()
      const newChild = getChild(parent, idx)
      if (!newChild) {
        throw new Error(
          `getEntitiesAlongPath: This entity doesn't have such child.`
        )
      }

      const hasChildren = entity =>
        isParent(entity) ? countChildren(entity) > 0 : false

      if (remainingPath.length > 0 && !hasChildren(newChild)) {
        throw new Error(
          `getEntitiesAlongPath: Path inaccessible, entity doesn't have any children. Stopped at [${path}]. Remaining path: [${remainingPath}]`
        )
      }

      result.push(newChild)
      if (remainingPath.length > 0 && isParent(newChild)) {
        return travel(newChild, remainingPath, result)
      } else {
        return result
      }
    }
    return travel(this, [...path])
  }

  logTreeState(state: State, logger: any = logs, startingPoint?: ParentTrait) {
    const travel = parent => {
      getChildren(parent).map(
        (child: ChildTrait & LabelTrait, idx, entities) => {
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

          const owner = getOwner(this, child)

          // const lastChild = entities.length - 1 === idx
          const sIdx = idx === child.idx ? `${idx}` : `e${child.idx}:s${idx}`
          const idxPath = getIdxPath(state, child)

          const childrenCount = isParent(child) ? countChildren(child) : "~~"
          const sChildren = childrenCount > 0 ? childrenCount : ""
          const sOwner = owner ? `(${owner.name} ${owner.clientID})` : ""
          // const branchSymbol = lastChild ? "┕━" : "┝━"

          const hasChildren = isParent(child) && childrenCount > 0

          logger[hasChildren ? "group" : "notice"](
            `[${idxPath}]`,
            `${child.type}:${child.name}-[${child.idx}]`,
            sChildren,
            sOwner
          )
          if (isParent(child) && childrenCount > 0) {
            travel(child)
            logger.groupEnd()
          }
        }
      )
    }

    if (!startingPoint) {
      logger.group(
        "ROOT",
        "(" + countChildren(this) + " direct children,",
        getDescendants(this).length,
        "in total)"
      )
    } else {
      const count = isChild(startingPoint) ? `[${startingPoint.idx}] ` : ""
      const name = hasIdentity(startingPoint)
        ? startingPoint.type + ":" + startingPoint.name
        : "unidentified entity"
      logger.group(count + name, countChildren(startingPoint) + "children")
    }
    travel(startingPoint || this)
    logger.groupEnd()
  }

  static events = {
    playerTurnStarted: Symbol("playerTurnStarted"),
    playerTurnEnded: Symbol("playerTurnEnded")
  }
}

export interface State extends LabelTrait, ParentTrait {}

applyMixins(State, [LabelTrait, ParentTrait])

export interface StateUI {
  clone: () => MapSchema
  onAdd: (item: any, key: string) => void
  onRemove: (item: any, key: string) => void
  onChange: (item: any, key: string) => void
}

export interface StateOptions extends Partial<State> {
  minClients: number
  maxClients: number
  hostID: string
}
