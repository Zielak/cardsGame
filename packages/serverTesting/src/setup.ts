import {
  Room,
  State,
  type RoomConstructor,
  type ActionDefinition,
} from "@cardsgame/server"

import { ExecuteEvent, executeEventSetup } from "./executeEvent.js"
import { InitState, initStateSetup } from "./initState.js"
import { type MakeEvent, makeEventSetup } from "./makeEvent.js"
import {
  type MakeInteraction,
  makeInteractionSetup,
} from "./makeInteraction.js"
import { PopulateState, populateStateSetup } from "./populateState.js"
import { Reset, resetSetup } from "./reset.js"
import { type TestEvent, testEventSetup } from "./testEvent.js"
import type { EntityConstructor, RoomGetter, StateGetter } from "./types.js"

// Sadly TS doesn't "extract" JSDoc from function types, so I gotta copy them here. At least first paragraphs, without examples
/**
 *
 * @category Setup
 */
export type SetupAPI<S extends State, R extends Room<S>> = {
  /**
   * Resets `room` and `state`, using `roomConstructor` provided earlier
   * with `setupServerTesting`.
   * To be used with `beforeEach()` of testing frameworks.
   *
   * Without calling this function, for example `populateState(...entitiesMap)`
   * might end up populating state object of previous test runs (which is bad!).
   */
  reset: Reset<S, R>
  /**
   * Populate your state with initial props (including players & clients).
   * Returns `state` object for further initial modification.
   *
   * To populate state with entities - prefer to use `populateState()`
   */
  initState: InitState<S>
  /**
   * Populates state with new entities.
   *
   * Use AFTER you prepared the base state yourself by using your
   * game's own state preparation functions.
   */
  populateState: PopulateState<S>
  /**
   * Construct interaction event object for use in `testEvent()`
   */
  makeInteraction: MakeInteraction
  makeEvent: MakeEvent
  /**
   * Test if given event would pass in gameplay under current conditions.
   */
  testEvent: TestEvent
  /**
   * Test how your Action would modify the game state.
   */
  executeEvent: ExecuteEvent
}

/**
 *
 * @category Setup
 */
export type SetupOptions<S extends State, R extends Room<S>> = {
  /**
   * Used only in `testEvent()`,
   * don't have to provide if you won't use that function.
   */
  action: ActionDefinition<S>
  /**
   * Used to construct State automatically and in `executeEvent()`,
   * don't have to provide if you won't use that function.
   */
  roomConstructor?: RoomConstructor<S, R>
  /**
   * List of custom entities present in your game, if any.
   * Used to figure out entity constructor just by it's `type`
   * from `statePreparation`
   */
  gameEntities?: Record<string, EntityConstructor>
}

/**
 * Client ID with which most of the events will be automatically created.
 * Assign it to the first player in your testing environment.
 */
export const CLIENT_ID = "CLIENT"

/**
 *
 * @param options
 * @returns
 *
 * @category Setup
 */
export function setupServerTesting<
  S extends State,
  R extends Room<S> = Room<S>
>({
  action,
  gameEntities,
  roomConstructor,
}: SetupOptions<S, R>): SetupAPI<S, R> {
  /**
   * STATE
   */
  // Keep reference to the state for usage in other functions
  let state: S
  const stateGetter: StateGetter<S> = () => state

  /**
   * ROOM
   */
  let room: R
  const roomGetter: RoomGetter<S, R> = () => room

  /**
   * FACADE
   */
  return {
    reset: resetSetup<S, R>((resetRoom, resetState) => {
      room = resetRoom
      state = resetState
    }, roomConstructor),
    initState: initStateSetup(stateGetter),
    populateState: populateStateSetup(stateGetter, gameEntities),
    makeEvent: makeEventSetup(stateGetter),
    makeInteraction: makeInteractionSetup(stateGetter),
    testEvent: testEventSetup(stateGetter, action),
    executeEvent: executeEventSetup(roomGetter),
  }
}
