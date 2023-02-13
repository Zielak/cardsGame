import {
  populatePlayerEvent,
  type ServerPlayerMessage,
  State,
  type QuerableProps,
} from "@cardsgame/server"

import { CLIENT_ID } from "./setup.js"
import type { StateGetter } from "./types.js"

export interface MakeInteraction {
  /**
   * Construct interaction event object for use in `testEvent()`
   */
  (entity: QuerableProps, interaction?: InteractionType): ServerPlayerMessage
}

/**
 * Construct interaction event object for use in `testEvent()`
 */
export function makeInteraction<S extends State>(
  state: S,
  entityQuery: QuerableProps,
  interaction: InteractionType = "tap"
): ServerPlayerMessage {
  if (!state) {
    throw new Error(`state is undefined, can't prepare an event without it`)
  }

  const targetEntity = state.query(entityQuery)

  const message: ClientPlayerMessage = {
    messageType: "EntityInteraction",
    entityPath: targetEntity?.idxPath,
    interaction,
  }

  return populatePlayerEvent(state, message, CLIENT_ID)
}

export function makeInteractionSetup<S extends State>(
  getState: StateGetter<S>
): MakeInteraction {
  return function makeInteractionInner(entity, event) {
    return makeInteraction(getState(), entity, event)
  }
}
