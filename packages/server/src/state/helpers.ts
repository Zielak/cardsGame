import { limit } from "@cardsgame/utils"

import { Bot, isBot, type Player } from "@/player/index.js"
import type { IdentityTrait } from "@/traits/identity.js"
import { hasChildren, isParent, ParentTrait } from "@/traits/parent.js"

import { logs } from "../logs.js"

import type { State } from "./state.js"

/**
 * Will get you an index of given player in turn queue.
 * Useful if you happen to have just a `Player` reference at hand.
 *
 * @category State
 */
export function getPlayersIndex(state: State, player: Player): number {
  return state.players.findIndex((p) => p === player)
}

/**
 * @category State
 */
export function getNextPlayerIdx(state: State): number {
  const current = limit(state.currentPlayerIdx, 0, state.players.length - 1)
  return current + 1 === state.players.length ? 0 : current + 1
}

/**
 * @category State
 */
export function getNextPlayer(state: State): Player {
  return state.players[getNextPlayerIdx(state)]
}

/**
 * @category State
 */
export function getPreviousPlayerIdx(state: State): number {
  const current = limit(state.currentPlayerIdx, 0, state.players.length - 1)
  return current - 1 === -1 ? state.players.length - 1 : current - 1
}

/**
 * @category State
 */
export function getPreviousPlayer(state: State): Player {
  return state.players[getPreviousPlayerIdx(state)]
}

/**
 * @category State
 */
export function getPlayerByName(state: State, name: string): Player {
  return state.players.find((player) => player.name === name)
}

/**
 * @category State
 */
export function getAllBots(state: State): Bot[] {
  return state.players.filter((player) => isBot(player)) as Bot[]
}

/**
 * Gets an array of all entities from the top-most parent
 * to the lowest of the child.
 *
 * @category State
 */
export function getEntitiesAlongPath(
  state: State,
  path: number[],
): IdentityTrait[] {
  const travel = (
    parent: ParentTrait,
    remainingPath: number[],
    result: any[] = [],
  ): any[] => {
    const idx = remainingPath.shift()
    const newChild = parent.getChild(idx)
    if (!newChild) {
      logs.error(
        "getEntitiesAlongPath",
        `This entity doesn't have [${idx}] child.`,
      )
      return result
    }

    if (remainingPath.length > 0 && !hasChildren(newChild)) {
      logs.error(
        "getEntitiesAlongPath",
        `Path inaccessible, entity doesn't have any children. Stopped at [${path}]. Remaining path: [${remainingPath}]`,
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
