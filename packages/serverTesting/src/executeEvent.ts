import type {
  ActionTemplate,
  Room,
  ServerPlayerMessage,
  State,
} from "@cardsgame/server"

import type { RoomGetter } from "./types"

export interface ExecuteEvent {
  /**
   * Test how your Action would modify the game state.
   *
   * Sends the message to room handle, just like the real client user would.
   * This effectively executes everything `testEvent()` would, AND all commands
   * defined in the ActionTemplate (if the conditions pass).
   *
   * @param event player's event, use `makeInteraction()` or `makeEvent()` for convenience
   *
   * @example
   * ```ts
   * // Action to grab a card from deck.
   * expect(state.deck.countChildren()).toBe(4)
   *
   * await executeEvent(deckEvent) // 🚀
   *
   * expect(state.deck.countChildren()).toBe(3)
   * ```
   */
  (event: ServerPlayerMessage): Promise<boolean>
}

/**
 * _this function can be run independently of `setupServerTesting()`_
 *
 * Test how your Action would modify the game state.
 *
 * Sends the message to room handle, just like the real client user would.
 * This effectively executes everything `testEvent()` would, AND all commands
 * defined in the ActionTemplate (if the conditions pass).
 *
 * @param room your game's room handle. It needs to include the Action you're testing in its `possibleActions` set.
 * @param event player's event, use `makeInteraction()` or `makeEvent()` for convenience
 *
 * @example
 * ```ts
 * // Action to grab a card from deck.
 * expect(state.deck.countChildren()).toBe(4)
 *
 * await executeEvent(room, deckEvent) // 🚀
 *
 * expect(state.deck.countChildren()).toBe(3)
 * ```
 */
export function executeEvent<S extends State, R extends Room<S>>(
  room: R,
  event: ServerPlayerMessage
): Promise<boolean> {
  return room.handleMessage(event)
}

export function executeEventSetup<S extends State, R extends Room<S>>(
  getRoom: RoomGetter<S, R>
): ExecuteEvent {
  return function executeEventInner(event) {
    return executeEvent(getRoom(), event)
  }
}
