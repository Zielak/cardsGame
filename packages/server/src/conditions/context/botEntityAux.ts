import { State } from "@/state/state.js"
import { ChildTrait } from "@/traits/child.js"

import { Conditions } from "../conditions.js"
import { ConditionsContextBase } from "../types.js"

export type BotEntityAuxContext<S extends State> = {
  entity: ChildTrait
} & ConditionsContextBase<S>

export type BotEntityAuxConditions<S extends State> = Conditions<
  BotEntityAuxContext<S>
>

/**
 * Helper type for `test().test(callback)` related to bot's "entitiesFilter".
 * Context will only contain state and entity for assertion.
 */
export type BotEntityAuxAssertionTester<S extends State> = Parameters<
  ReturnType<BotEntityAuxConditions<S>>["test"]
>[0]
