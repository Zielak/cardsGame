import type {
  ActionTemplate,
  ServerPlayerMessage,
  State,
} from "@cardsgame/server"
import {
  runConditionsOnAction,
  filterActionsByInteraction,
} from "@cardsgame/server/lib/interaction"

import type { StateGetter } from "./types"

export interface TestEvent {
  /**
   * Test if given event would pass in gameplay under current conditions.
   */
  (message: ServerPlayerMessage): boolean
}

/**
 * Test if given event would pass in gameplay under current conditions.
 */
export function testEvent<S extends State>(
  state: S,
  action: ActionTemplate<S>,
  message: ServerPlayerMessage
): boolean {
  const conditionError = runConditionsOnAction(state, message, action)

  return filterActionsByInteraction(message)(action) && !conditionError
}

export function testEventSetup<S extends State>(
  getState: StateGetter<S>,
  action: ActionTemplate<S>
): TestEvent {
  return function testEventInner(message: ServerPlayerMessage): boolean {
    return testEvent(getState(), action, message)
  }
}
