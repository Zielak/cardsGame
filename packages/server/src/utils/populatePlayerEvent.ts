import { ENTITY_INTERACTION } from "../interaction/types.js"
import type { Player, ServerPlayerMessage } from "../player/index.js"
import { getEntitiesAlongPath } from "../state/helpers.js"
import type { State } from "../state/state.js"
import { ChildTrait, isChild } from "../traits/child.js"

const sanitizeIdxPath = (value: unknown): number => {
  if (value !== value) {
    throw new Error(`sanitizeIdxPath | received ${value}`)
  }
  if (typeof value === "number") {
    return value
  }
  if (typeof value === "string") {
    const num = parseInt(value)
    if (num !== num) {
      throw new Error(
        `sanitizeIdxPath | received "${value}", parsed to "${num}".`
      )
    }
    return num
  }
  throw new Error(
    `sanitizeIdxPath | couldn't parse value of type "${typeof value}"`
  )
}

/**
 * Converts players message from the Client into `ServerPlayerMessage`.
 * Populates message with known server-side data
 * @ignore
 */
export function populatePlayerEvent(
  state: State,
  message: ClientPlayerMessage,
  clientID: string
): ServerPlayerMessage
/**
 * Converts players message from the Client into `ServerPlayerMessage`.
 * Populates message with known server-side data
 * @ignore
 */
export function populatePlayerEvent(
  state: State,
  message: ClientPlayerMessage,
  player: Player
): ServerPlayerMessage
/**
 * Converts players message from the Client into `ServerPlayerMessage`.
 * Populates message with known server-side data
 * @ignore
 */
export function populatePlayerEvent(
  state: State,
  message: ClientPlayerMessage,
  clientOrPlayer: string | Player
): ServerPlayerMessage {
  const newEvent: ServerPlayerMessage = {
    messageType: message.messageType,
    interaction: message.interaction,
    data: message.data,
    timestamp: +Date.now(),
  }

  if (message.entityPath && Array.isArray(message.entityPath)) {
    newEvent.entityPath = message.entityPath.map(sanitizeIdxPath)
    newEvent.entities = getEntitiesAlongPath(state, newEvent.entityPath)
      .reverse()
      .filter((target) => (isChild(target) ? target.isInteractive() : false))

    newEvent.entity = newEvent.entities[0]
  }

  const player =
    typeof clientOrPlayer === "string"
      ? state.players.find((p) => p.clientID === clientOrPlayer)
      : clientOrPlayer

  if (player) {
    newEvent.player = player
  }

  return newEvent
}
