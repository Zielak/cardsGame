import {
  defineRoom,
  type Room,
  State,
  type RoomConstructor,
} from "@cardsgame/server"

type ResetOptions = {
  callOnInitGame: boolean
}

export interface Reset<S extends State, R extends Room<S>> {
  /**
   * Resets `room` and `state`, using `roomConstructor` provided earlier
   * with `setupServerTesting`.
   * To be used with `beforeEach()` of testing frameworks.
   *
   * Without calling this function, for example `populateState(...entitiesMap)`
   * might end up populating state object of previous test runs (which is bad!).
   */
  (options?: ResetOptions): void
}

/**
 * Resets `room` and `state`, using `roomConstructor` provided earlier
 * with `setupServerTesting`.
 * To be used with `beforeEach()` of testing frameworks.
 *
 * Without calling this function, for example `populateState(...entitiesMap)`
 * might end up populating state object of previous test runs (which is bad!).
 */
export function reset<S extends State, R extends Room<S>>(
  options: ResetOptions,
  callback: (room: R, state: S) => void,
  roomConstructor?: RoomConstructor<S, R>
): void {
  let room: R

  if (roomConstructor) {
    room = new roomConstructor()
  } else {
    room = new (defineRoom<S, R>("TestingRoom", {}))()
  }

  if (!options.callOnInitGame) {
    room.onInitGame = function () {}
  }

  /**
   * TODO: pass `variantData` when I decide how it's supposed to come in from the front-end...
   */
  // Would be called by server app, setup commands manager etc.
  room.onCreate()

  const state = room.state

  callback(room, state)
}

export function resetSetup<S extends State, R extends Room<S>>(
  callback: (room: R, state: S) => void,
  roomConstructor?: RoomConstructor<S, R>
): Reset<S, R> {
  return function resetInner(
    options: ResetOptions = { callOnInitGame: false }
  ) {
    return reset<S, R>(options, callback, roomConstructor)
  }
}
