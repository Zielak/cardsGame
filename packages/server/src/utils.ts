import { State } from "./state"
import { Client } from "colyseus"
import { ServerPlayerEvent, Player } from "./player"
import { map2Array } from "@cardsgame/utils"
import { isChild, hasLabel, hasIdentity } from "./traits"

export const populatePlayerEvent = (
  state: State,
  event: ClientPlayerEvent,
  client: Client
) => {
  // Populate event with server-side known data
  const newEvent: ServerPlayerEvent = {
    command: event.command,
    data: event.data
  }
  if (event.entityPath) {
    newEvent.entityPath =
      typeof event.entityPath === "string"
        ? event.entityPath.split(",").map(idx => parseInt(idx))
        : event.entityPath

    newEvent.entities = state
      .getEntitiesAlongPath(newEvent.entityPath)
      .reverse()
      .filter(target => (isChild(target) ? target.isInteractive() : false))

    newEvent.entity = newEvent.entities[0]
  }

  const player = map2Array<Player>(state.players).find(
    p => p.clientID === client.id
  )

  if (player) {
    newEvent.player = player
  }

  return newEvent
}

export const getLabel = (entity): string => {
  if (hasLabel(entity)) {
    return `"${entity.type}.${entity.name}"`
  } else if (hasIdentity(entity)) {
    return `"id:${entity.id}"`
  }
  return `"unknown entity"`
}
