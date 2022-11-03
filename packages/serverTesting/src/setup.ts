import { type ActionTemplate, Room, State } from "@cardsgame/server"

import { ExecuteEvent, executeEventSetup } from "./executeEvent.js"
import { InitState, initStateSetup } from "./initState.js"
import { type MakeEvent, makeEventSetup } from "./makeEvent.js"
import {
  type MakeInteraction,
  makeInteractionSetup,
} from "./makeInteraction.js"
import { PopulateState, populateStateSetup } from "./populateState.js"
import { type TestEvent, testEventSetup } from "./testEvent.js"
import type { EntityConstructor, RoomGetter, StateGetter } from "./types.js"

interface Resetter<S extends State, R extends Room<S>> {
  (newState: S, newRoom?: R): void
}

// Sadly TS doesn't "extract" JSDoc from function types, so I gotta copy them here. At least first paragraphs, without examples
/**
 *
 * @category Setup
 */
export type SetupAPI<S extends State, R extends Room<S>> = {
  /**
   * Will remember new reference to the State and Room object for use in other
   * functions of `setupServerTesting()`.
   *
   * Without calling this function, for example `populateState(...entitiesMap)`
   * might end up populating state object of previous test runs (which is bad!).
   */
  reset: Resetter<S, R>
  /**
   * Create your state and populate it with provided props and entities.
   * Include definitions of child entities in `children` array.
   */
  initState: InitState<S>
  /**
   * Populates state with new entities.
   *
   * Use AFTER you prepared the base state yourself by using your
   * game's own state preparation functions. Modifies state in-place.
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
  action: ActionTemplate<S>
  /**
   * Used only in `initState()`,
   * don't have to provide if you won't use that function.
   */
  stateConstructor?: new () => S
  /**
   * Used only in `executeEvent()`,
   * don't have to provide if you won't use that function.
   */
  roomConstructor?: new () => R
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
  stateConstructor,
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
    reset: (newState, newRoom) => {
      state = newState
      if (newRoom) {
        room = newRoom
      } else {
        room = roomConstructor
          ? new roomConstructor()
          : (new Room<S>() as unknown as R)
      }
      room.onInitGame = function () {
        // Overwrite room's own state creation function?
        this.setState(state)
      }
      // Would be called by server app, setup commands manager etc.
      room.onCreate()
    },
    initState: initStateSetup(stateConstructor, gameEntities),
    populateState: populateStateSetup(stateGetter, gameEntities),
    makeEvent: makeEventSetup(stateGetter),
    makeInteraction: makeInteractionSetup(stateGetter),
    testEvent: testEventSetup(stateGetter, action),
    executeEvent: executeEventSetup(roomGetter),
  }
}
