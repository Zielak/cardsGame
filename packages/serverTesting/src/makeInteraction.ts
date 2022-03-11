import {
  populatePlayerEvent,
  ServerPlayerMessage,
  State,
} from "@cardsgame/server"
import type { QuerableProps } from "@cardsgame/server/lib/queryRunner"

import { CLIENT_ID } from "./setup"
import type { StateGetter } from "./types"

export interface MakeInteraction {
  /**
   * Construct interaction event object for use in `testEvent()`
   */
  (
    entity: QuerableProps,
    event?: RawInteractionClientPlayerMessage["event"]
  ): ServerPlayerMessage
}

/**
 * Construct interaction event object for use in `testEvent()`
 */
export function makeInteraction<S extends State>(
  state: S,
  entityQuery: QuerableProps,
  event?: RawInteractionClientPlayerMessage["event"]
): ServerPlayerMessage {
  if (!state) {
    throw new Error(`state is undefined, can't prepare an event without it`)
  }

  const targetEntity = state.query(entityQuery)

  const message: ClientPlayerMessage = {
    messageType: "EntityInteraction",
    entityPath: targetEntity?.idxPath,
    event,
  }

  const result = populatePlayerEvent(state, message, CLIENT_ID)

  return result
}

export function makeInteractionSetup<S extends State>(
  getState: StateGetter<S>
): MakeInteraction {
  return function makeInteractionInner(entity, event) {
    return makeInteraction(getState(), entity, event)
  }
}
