import { Client } from "colyseus"

import { map2Array } from "@cardsgame/utils"

import { Player, ServerPlayerEvent } from "./player"
import { getEntitiesAlongPath } from "./state/helpers"
import { State } from "./state/state"
import { isChild } from "./traits/child"
import { hasIdentity } from "./traits/identity"
import { hasLabel } from "./traits/label"

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
    newEvent.entityPath =
      typeof event.entityPath === "string"
        ? event.entityPath.split(",").map((idx) => parseInt(idx))
        : event.entityPath

    newEvent.entities = getEntitiesAlongPath(state, newEvent.entityPath)
      .reverse()
      .filter((target) => (isChild(target) ? target.isInteractive : false))

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
