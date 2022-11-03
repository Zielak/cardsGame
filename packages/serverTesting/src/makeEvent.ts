import {
  populatePlayerEvent,
  type ServerPlayerMessage,
  State,
} from "@cardsgame/server"

import { CLIENT_ID } from "./setup.js"
import type { StateGetter } from "./types.js"

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
  return populatePlayerEvent(state, { ...message, messageType }, CLIENT_ID)
}

export function makeEventSetup<S extends State>(
  getState: StateGetter<S>
): MakeEvent {
  return function makeEventInner(message, messageType) {
    return makeEvent(getState(), message, messageType)
  }
}
