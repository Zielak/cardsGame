import {
  populatePlayerEvent,
  ServerPlayerMessage,
  State,
} from "@cardsgame/server"

import { CLIENT_ID } from "./setup"
import type { StateGetter } from "./types"

export interface MakeEvent {
  (
    message: RawInteractionClientPlayerMessage,
    messageType?: string
  ): ServerPlayerMessage
}

export function makeEvent<S extends State>(
  state: S,
  message: RawInteractionClientPlayerMessage,
  messageType = "EntityInteraction"
): ServerPlayerMessage {
  const result = populatePlayerEvent(
    state,
    { ...message, messageType },
    CLIENT_ID
  )

  return result
}

export function makeEventSetup<S extends State>(
  getState: StateGetter<S>
): MakeEvent {
  return function makeEventInner(message, messageType) {
    return makeEvent(getState(), message, messageType)
  }
}
