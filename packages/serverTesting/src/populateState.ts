import { type State, traits } from "@cardsgame/server"

import { copyEntityPrimitives } from "./state/copyPrimitives.js"
import { parseChildren } from "./state/parseChildren.js"
import type {
  EntityConstructor,
  StateGetter,
  PopulateStateTuple,
} from "./types.js"

export interface PopulateState<S extends State> {
  /**
   * Populates state with new entities.
   *
   * Use AFTER you prepared the base state yourself by using your
   * game's own state preparation functions. Modifies state in-place.
   *
   * @param {...PopulateStateTuple} entitiesMap Tuples of "entity queries" to "entity definitions".
   * Finds an already existing entity and fills it with new data/entities to test.
   *
   * @example
   * ```ts
   * state = populateState(
   *   [ { name: "hand0" }, { children: [{ name: "SK" }], selected: [0] } ]
   * )
   * ```
   * - Would find entity named "hand0" (eg. first player's hand)
   * - Create new card King of Spades
   * - And finally mark that card selected ([0] in this case assuming it's first and only card in "hand0")
   *
   * @example
   * ```ts
   * state = populateState(
   *   [ null, { name: "C7" } ]
   * )
   * ```
   * - Would add card 7 of Clubs directly on the state/table
   * - Note `null` -> no query = fallback to root state object
   *
   *
   * @example
   * Perform multiple additions in one go:
   * ```ts
   * state = populateState(
   *   [ { name: "hand0" }, { children: [{ name: "SK" }], selected: [0] } ],
   *   [ null, { name: "C7" } ],
   *   [ { type: "pile" }, { children: [{ name: "C2" }, { name: "C3" }, { name: "C4" }] } ],
   * )
   * ```
   *
   * @returns the same state just for convenience.
   */
  (...entitiesMap: PopulateStateTuple[]): S
}

/**
 * _this function can be run independently of `setupServerTesting()`_
 *
 * Use AFTER you prepared the base state yourself by using your
 * game's own state preparation functions. Modifies state in-place.
 *
 * @param state State to populate with new entities
 * @param entitiesMap Tuples of "entity queries" to "entity definitions".
 * Finds an already existing entity and fills it with new data/entities to test.
 * @param gameEntities optional record of your game's custom entities.
 *
 * @example
 * ```ts
 * populateState(
 *   state,
 *   [
 *     [ { name: "hand0" }, { children: [{ name: "SK" }], selected: [0] } ]
 *   ]
 * )
 * ```
 * - Would find entity named "hand0" (eg. first player's hand)
 * - Create new card King of Spades
 * - And finally mark that card selected ([0] in this case assuming it's first and only card in "hand0")
 *
 * @example
 * ```ts
 * populateState(
 *   state,
 *   [
 *     [ null, { name: "C7" } ]
 *   ]
 * )
 * ```
 * - Would add card 7 of Clubs directly on the state/table
 * - Note `null` -> no query = fallback to root state object
 *
 *
 * @example
 * Perform multiple additions in one go:
 * ```ts
 * populateState(
 *   state,
 *   [
 *     [ { name: "hand0" }, { children: [{ name: "SK" }], selected: [0] } ],
 *     [ null, { name: "C7" } ],
 *     [ { type: "pile" }, { children: [{ name: "C2" }, { name: "C3" }, { name: "C4" }] } ]
 *   ]
 * )
 * ```
 *
 * @returns the same state just for convenience.
 */
export function populateState<S extends State>(
  state: S,
  entitiesMap: PopulateStateTuple[],
  gameEntities?: Record<string, EntityConstructor>
): S {
  if (!entitiesMap) {
    return state
  }

  entitiesMap.forEach(([query, def]) => {
    const entity = state.query(query) || state

    copyEntityPrimitives(entity, def)

    // Recursively add all children
    if (def.children) {
      if (traits.isParent(entity)) {
        parseChildren(state, entity, def, gameEntities)
      } else {
        throw new Error(
          `entity isn't of ParentTrait and cannot accept children. query: ${JSON.stringify(
            query
          )}, `
        )
      }
    }
  })

  return state
}

export function populateStateSetup<S extends State>(
  getState: StateGetter<S>,
  gameEntities?: Record<string, EntityConstructor>
): PopulateState<S> {
  return function populateStateInner(...args): S {
    return populateState(getState(), args, gameEntities)
  }
}
