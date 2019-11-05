import { State } from "./state"
import { Client } from "colyseus"
import { ServerPlayerEvent, Player } from "./player"
import { map2Array } from "@cardsgame/utils"
import { isChild } from "./traits"

export const populatePlayerEvent = (
  state: State,
  event: PlayerEvent,
  client: Client
) => {
  // Populate event with server-side known data
  const newEvent: ServerPlayerEvent = { ...event }
  if (newEvent.entityPath) {
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
