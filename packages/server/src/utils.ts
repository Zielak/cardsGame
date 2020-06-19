import { Client } from "colyseus"

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

export const populatePlayerEvent = (
  state: State,
  event: ClientPlayerEvent,
  client: Client
): ServerPlayerEvent => {
  // Populate event with server-side known data
  const newEvent: ServerPlayerEvent = {
    command: event.command,
    data: event.data,
  }
  if (event.entityPath) {
    newEvent.entityPath = event.entityPath.map(sanitizeIdxPath)
    newEvent.entities = getEntitiesAlongPath(state, newEvent.entityPath)
      .reverse()
      .filter((target) => (isChild(target) ? target.isInteractive() : false))

    newEvent.entity = newEvent.entities[0]
  }

  const player = map2Array<Player>(state.players).find(
    (p) => p.clientID === client.id
  )

  if (player) {
    newEvent.player = player
  }

  return newEvent
}
