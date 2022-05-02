import type { Room } from "./room"
import type { State } from "./state"

type IntegrationHookCallbackContext<S extends State> = {
  addClient: Room<S>["addClient"]
}

type IntegrationHookCallback<S extends State> = (
  state: S,
  context: IntegrationHookCallbackContext<S>
) => void
/**
 * Depending on integration tests I might allow more hooks.
 */
export type IntegrationHookNames = "init" | "startPre" | "startPost"
/**
 * Pass { test: "integrationTestName" } options while creating the room.
 * Your integration test callbacks will be executed on init or start hooks.
 */
export type IntegrationHooks<S extends State = State> = Partial<
  Record<IntegrationHookNames, IntegrationHookCallback<S>>
>
