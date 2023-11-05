import { Player, State } from "@cardsgame/server"

import {
  copyEntityPrimitives,
  copyStatePrimitives,
} from "./state/copyPrimitives.js"
import type { StateGetter, InitialStateDescription } from "./types.js"

export interface InitState<S extends State> {
  /**
   * Populate your state with initial props (including players & clients).
   * Returns `state` object for further initial modification.
   *
   * To populate state with entities - prefer to use `populateState()`
   *
   * @example
   * ```ts
   * state = initState({
   *   isGameStarted: true,
   *   round: 10,
   *   players: [
   *     { clientID: "clientA", name: "Darek" },
   *     { clientID: "clientB", name: "Alan" },
   *   ],
   * })
   * ```
   * - Would mark game as already started and set round to 10
   * - And create 2 `Player` entries in `state.players` array
   */
  (statePreparation: InitialStateDescription<S>): S
}

/**
 * Populate your state with initial props (including players & clients).
 * Returns `state` object for further initial modification.
 *
 * To populate state with entities - prefer to use `populateState()`
 *
 * @example
 * ```ts
 * state = initState({
 *   isGameStarted: true,
 *   round: 10,
 *   players: [
 *     { clientID: "clientA", name: "Darek" },
 *     { clientID: "clientB", name: "Alan" },
 *   ],
 * })
 * ```
 * - Would mark game as already started and set round to 10
 * - And create 2 `Player` entries in `state.players` array
 */
export function initState<S extends State>(
  state: S,
  statePreparation: InitialStateDescription<S>
): S {
  if (!statePreparation) {
    throw new Error("initState | statePreparation is required")
  }

  copyStatePrimitives(state, statePreparation)

  // State's ArraySchema and MapSchemas, careful
  statePreparation.clients?.forEach((clientID) => {
    state.clients.push(clientID)
  })
  statePreparation.players?.forEach((playerDef) => {
    state.players.push(
      new Player({
        clientID: playerDef.clientID || "" + Math.random(),
        ...playerDef,
      })
    )
  })

  return state
}

export function initStateSetup<S extends State>(
  getState: StateGetter<S>
): InitState<S> {
  return function initStateInner(statePreparation: InitialStateDescription<S>) {
    return initState<S>(getState(), statePreparation)
  }
}
