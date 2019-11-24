import { MapSchema } from "@colyseus/schema"
import { logs } from "@cardsgame/utils"
import { mapCount } from "@cardsgame/utils"

import { type, containsChildren } from "./annotations"
import { isParent, ParentTrait } from "./traits/parent"
import { Player } from "./player"
import { PlayerViewPosition } from "./playerViewPosition"
import {
  Entity,
  LabelTrait,
  hasLabel,
  applyMixins,
  IdentityTrait,
  hasChildren
} from "./traits"
import { ChildTrait, isChild } from "./traits/child"
import { hasOwnership } from "./traits/ownership"

@containsChildren()
@applyMixins([IdentityTrait, LabelTrait, ParentTrait])
export class State extends Entity<{}> {
  type = "state"

  @type("number") tableWidth = 60 // 60 cm

  @type("number") tableHeight = 60 // 60 cm

  /**
   * IDs of clients who are connecting to the room.
   * A "client" is someone who just stopped by in this room
   * and not necessarily someone who is playing the game.
   */
  @type({ map: "string" }) clients = new MapSchema<string>()

  /**
   * How much clients are connected to the room
   */
  get clientsCount(): number {
    return mapCount(this.clients)
  }

  /**
   * Games are turn-based by default. Each player takes their turns one by one.
   * Set this to `false` to allow simultaneous play.
   * Don't rely on `currentPlayer` value for non turn-based games.
   */
  @type("boolean") turnBased: boolean = true

  /**
   * Current round number. Increased using `NextRound` command.
   */
  @type("uint16") round: number = 0

  /**
   * List of player - game participants, after the game starts.
   */
  @type({ map: Player }) players = new MapSchema<Player>()

  @type("uint8") currentPlayerIdx: number = 0

  get currentPlayer(): Player {
    return this.turnBased ? this.players[this.currentPlayerIdx] : null
  }

  get playersCount(): number {
    return mapCount(this.players)
  }

  /**
   * Will get you an index of given player in turn queue.
   * Useful if you happen to have just a `Player` reference at hand.
   * @param player
   */
  getPlayersIndex(player: Player): number {
    return parseInt(
      Object.keys(this.players).find(idx => this.players[idx] === player)
    )
  }

  @type("boolean") isGameStarted = false
  @type("boolean") isGameOver = false

  @type({ map: "string" }) ui: StateUI = new MapSchema<string | string[]>()

  /**
   * A construct describing how should player's main items
   * be positioned in his view. Containers of other players
   * will not follow these rules.
   * Default is: center/bottom, +10 px up.
   */
  @type(PlayerViewPosition) playerViewPosition = new PlayerViewPosition()

  /**
   * @private
   */
  _lastID = -1

  /**
   * Use `find()` or `getEntity()` methods instead.
   * @private
   */
  _allEntities = new Map<number, IdentityTrait>()

  constructor() {
    super(undefined)

    this.hijacksInteractionTarget = false
  }

  /**
   * Registers new entity to the game state
   * @param entity
   * @returns new ID to be assigned to that entity
   */
  registerEntity(entity) {
    const newID = ++this._lastID
    this._allEntities.set(newID, entity)
    return newID
  }

  // TODO: Separate this function to `getEntityByID` and `getEntityByIdxPath`. State also has `find` automatically
  // TODO: wait... isn't this function also `getEntitiesAlongPath`?
  // FIXME: Deprecate. It's not used anywhere...
  /**
   * Get an Entity by its ID
   * @deprecated
   * @param id
   */
  getEntity(id: EntityID)
  /**
   * Get an Entity by its idx path
   * @deprecated
   * @param path
   */
  getEntity(path: number[])
  /**
   * @deprecated
   * @param idOrPath
   */
  getEntity(idOrPath: EntityID | number[]) {
    if (Array.isArray(idOrPath)) {
      const travel = (parent: ParentTrait, remainingPath: number[]) => {
        const idx = remainingPath.shift()
        const newChild = parent.getChild(idx)
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
      const newChild = parent.getChild(idx)
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
      if (remainingPath.length > 0 && isParent(newChild)) {
        return travel(newChild, remainingPath, result)
      } else {
        return result
      }
    }
    return travel(this, [...path])
  }

  logTreeState(logger: any = logs, startingPoint?: ParentTrait) {
    const travel = parent => {
      parent
        .getChildren()
        .map((child: ChildTrait & LabelTrait, idx, entities) => {
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

          const owner = hasOwnership(child) ? child.getOwner() : undefined

          // const lastChild = entities.length - 1 === idx
          const sIdx = idx === child.idx ? `${idx}` : `e${child.idx}:s${idx}`
          const idxPath = child.getIdxPath()

          const childrenCount = isParent(child) ? child.countChildren() : "~~"
          const sChildren = childrenCount > 0 ? childrenCount : ""
          const sOwner = owner ? `(${owner.name} ${owner.clientID})` : ""
          // const branchSymbol = lastChild ? "┕━" : "┝━"

          logger[hasChildren(child) ? "group" : "notice"](
            `[${idxPath}]`,
            `${child.type}:${child.name}-[${child.idx}]`,
            sChildren,
            sOwner
          )
          if (isParent(child) && childrenCount > 0) {
            travel(child)
            logger.groupEnd()
          }
        })
    }

    if (!startingPoint) {
      logger.group(
        "ROOT",
        "(" + this.countChildren() + " direct children,",
        this.getDescendants().length,
        "in total)"
      )
    } else {
      const count = isChild(startingPoint) ? `[${startingPoint.idx}] ` : ""
      const name = hasLabel(startingPoint)
        ? startingPoint.type + ":" + startingPoint.name
        : "unidentified entity"
      logger.group(count + name, startingPoint.countChildren() + "children")
    }
    travel(startingPoint || this)
    logger.groupEnd()
  }
}

interface Mixin extends IdentityTrait, LabelTrait, ParentTrait {}

export interface State extends Mixin {}

export interface StateUI {
  clone: () => MapSchema
  onAdd: (item: any, key: string) => void
  onRemove: (item: any, key: string) => void
  onChange: (item: any, key: string) => void
}
