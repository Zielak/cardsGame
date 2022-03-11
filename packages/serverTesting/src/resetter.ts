import type { Room, State } from "@cardsgame/server"

/**
 * Will remember new reference to the State and Room object for use in other
 * functions of `setupServerTesting()`.
 *
 * Without calling this function, for example `populateState(...entitiesMap)`
 * might end up populating state object of previous test runs (which is bad!).
 *
 * @example
 * ```ts
 * const { setState, populateState } = setupServerTesting(State, Action)
 *
 * let state = gamesStateGeneratingFunction()
 *
 * setState(state) // <-👌
 *
 * populateState([
 *   { type: "pile" }, { children: [{ name: "SK" }] }
 * ])
 * ```
 *
 * This function doesn't affect server-testing functions imported directly
 * from this module, where you need to pass state reference yourself:
 * ```ts
 * import { populateState } from '@cardsgame/server-testing'
 *
 * const state = new State()
 *
 * populateState(state, [
 *   [{ type: "pile" }, { children: [{ name: "SK" }] }]
 * ])
 * ```
 */
export interface Resetter<S extends State, R extends Room<S>> {
  (newState: S, newRoom?: R): void
}
