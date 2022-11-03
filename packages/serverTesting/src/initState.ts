import { Player, State } from "@cardsgame/server"

import { copyPrimitives } from "./state/copyPrimitives.js"
import { parseChildren } from "./state/parseChildren.js"
import type { EntityConstructor, StateMockingRecord } from "./types.js"

export interface InitState<S extends State> {
  /**
   * Create your state and populate it with provided props and entities.
   * Include definitions of child entities in `children` array.
   *
   * @example
   * ```ts
   * state = initState({
   *   isGameStarted: true,
   *   children: [
   *     {
   *       type: "hand",
   *       children: [{ name: "SK" }],
   *       selected: [0],
   *     },
   *   ],
   * })
   * ```
   * - Would create a hand
   * - Add new card King of Spades to the hand
   * - And finally mark that card as selected
   *
   */
  (statePreparation?: StateMockingRecord<S>): S
}

/**
 * Create your state and populate it with provided props and entities.
 * Include definitions of child entities in `children` array.
 *
 * @example
 * ```ts
 * state = initState(
 *   State,
 *   {
 *     isGameStarted: true,
 *     children: [
 *       {
 *         type: "hand",
 *         children: [{ name: "SK" }],
 *         selected: [0],
 *       },
 *     ],
 *   }
 * )
 * ```
 * - Would create a hand
 * - Add new card King of Spades to the hand
 * - And finally mark that card as selected
 *
 */
export function initState<S extends State>(
  statePreparation?: StateMockingRecord<S>,
  stateConstructor?: new () => S,
  gameEntities?: Record<string, EntityConstructor>
): S {
  if (!stateConstructor) {
    stateConstructor = State as unknown as new () => S
  }
  const state = new stateConstructor()

  if (!statePreparation) {
    return state
  }

  copyPrimitives(state, statePreparation)

  // Recursively add all children
  parseChildren(state, state, statePreparation, gameEntities)

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
  stateConstructor?: new () => S,
  gameEntities?: Record<string, EntityConstructor>
): InitState<S> {
  return function initStateInner(stateRecord: StateMockingRecord<S>) {
    return initState(stateRecord, stateConstructor, gameEntities)
  }
}
