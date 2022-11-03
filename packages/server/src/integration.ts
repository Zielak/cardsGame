import type { Room } from "./room.js"
import type { State } from "./state/state.js"

export type IntegrationHookCallbackContext<S extends State> = {
  data: Readonly<Record<string, any>>
  addClient: Room<S>["addClient"]
}

export type IntegrationHookCallback<S extends State> = (
  state: S,
  context: IntegrationHookCallbackContext<S>
) => void

/**
 * Additional data persisting through the room.
 * Use it to hold some test-related flags,
 * eg. `data.shuffle: false` to not shuffle Deck on game start.
 *
 * Will be frozen.
 */
export type IntegrationHookData = Record<string, any>

/**
 * Depending on integration tests I might allow more hooks.
 */
export type IntegrationHookNames = "init" | "startPre" | "startPost"

/**
 * Pass `{ test: "integrationTestName" }` options while creating the room.
 * Your integration test callbacks will be executed on init or start hooks.
 */
export type IntegrationHooks<S extends State = State> = Partial<
  Record<IntegrationHookNames, IntegrationHookCallback<S>> & {
    data?: IntegrationHookData
  }
>
