import { State } from "../state/state.js"

import { BotNeuron } from "./botNeuron.js"

/**
 * Helper type for `test().test(callback)` related to bot's "entitiesFilter".
 * Context will only contain state and entity for assertion.
 */
export type BotValueTester<S extends State> = BotNeuron<S>["value"]
