import { logs, map2Array } from "@cardsgame/utils"

import { Bot, isBot } from "../players/bot"
import { Player } from "../players/player"
import { ChildTrait, isChild } from "../traits/child"
import { IdentityTrait } from "../traits/identity"
import { hasLabel, LabelTrait } from "../traits/label"
import { hasOwnership } from "../traits/ownership"
import { hasChildren, isParent, ParentTrait } from "../traits/parent"
import { State } from "./state"

/**
 * Will get you an index of given player in turn queue.
 * Useful if you happen to have just a `Player` reference at hand.
 */
export function getPlayersIndex(state: State, player: Player): number {
  return parseInt(
    Object.keys(state.players).find((idx) => state.players[idx] === player)
  )
}

export function getNextPlayerIdx(state: State): number {
  const current = state.currentPlayerIdx
  return current + 1 === state.playersCount ? 0 : current + 1
}

export function getNextPlayer(state: State): Player {
  return state.players[getNextPlayerIdx(state)]
}

export function getPreviousPlayerIdx(state: State): number {
  const current = state.currentPlayerIdx
  return current - 1 === -1 ? state.playersCount - 1 : current - 1
}

export function getPreviousPlayer(state: State): Player {
  return state.players[getPreviousPlayerIdx(state)]
}

export function getPlayerByName(state: State, name: string): Player {
  return map2Array<Player>(state.players).find((player) => player.name === name)
}

export function getAllBots(state: State): Bot[] {
  return map2Array<any>(state.players).filter((player) => isBot(player))
}

/**
 * Gets an array of all entities from the top-most parent
 * to the lowest of the child.
 */
export function getEntitiesAlongPath(
  state: State,
  path: number[]
): IdentityTrait[] {
  const travel = (
    parent: ParentTrait,
    remainingPath: number[],
    result: any[] = []
  ): any[] => {
    const idx = remainingPath.shift()
    const newChild = parent.getChild(idx)
    if (!newChild) {
      logs.error("getEntitiesAlongPath", `This entity doesn't have such child.`)
      return result
    }

    if (remainingPath.length > 0 && !hasChildren(newChild)) {
      logs.error(
        "getEntitiesAlongPath",
        `Path inaccessible, entity doesn't have any children. Stopped at [${path}]. Remaining path: [${remainingPath}]`
      )
      return result
    }

    result.push(newChild)
    if (remainingPath.length > 0 && isParent(newChild)) {
      return travel(newChild, remainingPath, result)
    } else {
      return result
    }
  }
  return travel(state, [...path])
}

export function logTreeState(
  state: State,
  logger: any = logs,
  startingPoint?: ParentTrait
): void {
  const travel = (parent): void => {
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

        const owner = hasOwnership(child) ? child.owner : undefined

        // const lastChild = entities.length - 1 === idx
        const idxPath = child.idxPath

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
    logger.group("ROOT", "(" + this.countChildren() + " direct children")
  } else {
    const count = isChild(startingPoint) ? `[${startingPoint.idx}] ` : ""
    const name = hasLabel(startingPoint)
      ? startingPoint.type + ":" + startingPoint.name
      : "unidentified entity"
    logger.group(count + name, startingPoint.countChildren() + "children")
  }
  travel(startingPoint || state)
  logger.groupEnd()
}
