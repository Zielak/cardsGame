import { map2Array } from "@cardsgame/utils"

import { Player, ServerPlayerMessage } from "./players/player"
import { getEntitiesAlongPath } from "./state/helpers"
import { State } from "./state/state"
import { isChild } from "./traits/child"

const sanitizeIdxPath = (value: unknown): number => {
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
  return 998
}

export function populatePlayerEvent(
  state: State,
  message: ClientPlayerMessage,
  clientID: string
): ServerPlayerMessage
export function populatePlayerEvent(
  state: State,
  message: ClientPlayerMessage,
  player: Player
): ServerPlayerMessage
/**
 * Converts players message from the Client into `ServerPlayerMessage`.
 * Populates message with known server-side data
 */
export function populatePlayerEvent(
  state: State,
  message: ClientPlayerMessage,
  clientOrPlayer: string | Player
): ServerPlayerMessage {
  const newEvent: ServerPlayerMessage = {
    messageType: message.messageType,
    data: message.data,
    timestamp: +Date.now(),
  }

  if (message.entityPath) {
    newEvent.entityPath = message.entityPath.map(sanitizeIdxPath)
    newEvent.entities = getEntitiesAlongPath(state, newEvent.entityPath)
      .reverse()
      .filter((target) => (isChild(target) ? target.isInteractive() : false))

    newEvent.entity = newEvent.entities[0]
  }

  const player =
    typeof clientOrPlayer === "string"
      ? map2Array<Player>(state.players).find(
          (p) => p.clientID === clientOrPlayer
        )
      : clientOrPlayer

  if (player) {
    newEvent.player = player
  }

  return newEvent
}
