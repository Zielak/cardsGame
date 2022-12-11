import {
  populatePlayerEvent,
  type ServerPlayerMessage,
  State,
} from "@cardsgame/server"

import { CLIENT_ID } from "./setup.js"
import type { StateGetter } from "./types.js"

export interface MakeEvent {
  (messageType: string, data?: unknown): ServerPlayerMessage
}

/**
 * Construct message event object for use in `testEvent()`
 */
export function makeEvent<S extends State>(
  state: S,
  messageType: string,
  data?: unknown
): ServerPlayerMessage {
  const message: ClientPlayerMessage = {
    messageType,
    data,
  }

  return populatePlayerEvent(state, message, CLIENT_ID)
}

export function makeEventSetup<S extends State>(
  getState: StateGetter<S>
): MakeEvent {
  return function makeEventInner(messageType, data) {
    return makeEvent(getState(), messageType, data)
  }
}
