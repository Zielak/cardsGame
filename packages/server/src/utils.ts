import { map2Array } from "@cardsgame/utils"

import { Player, ServerPlayerEvent } from "./players/player"
import { getEntitiesAlongPath } from "./state/helpers"
import { State } from "./state/state"
import { isChild } from "./traits/child"

const sanitizeIdxPath = (value: unknown): number => {
  if (typeof value === "number") return value
  if (typeof value === "string") {
    const num = parseInt(value)
    // Notice me, I'm highly improbable number, you did sumting wong!
    return num !== num ? 999 : parseInt(value)
  }
  return 998
}

export function populatePlayerEvent(
  state: State,
  event: ClientPlayerEvent,
  clientID: string
): ServerPlayerEvent
export function populatePlayerEvent(
  state: State,
  event: ClientPlayerEvent,
  player: Player
): ServerPlayerEvent
export function populatePlayerEvent(
  state: State,
  event: ClientPlayerEvent,
  clientOrPlayer: string | Player
): ServerPlayerEvent {
  // TODO: event may be an empty object. Maybe push that as last and optional argument?
  // Populate event with server-side known data
  const newEvent: ServerPlayerEvent = {
    command: event.command,
    data: event.data,
    timestamp: +Date.now(),
  }
  if (event.entityPath) {
    newEvent.entityPath = event.entityPath.map(sanitizeIdxPath)
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
