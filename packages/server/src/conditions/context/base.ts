import { State } from "../../state/state.js"
import { Conditions } from "../conditions.js"
import { ConditionsContextBase } from "../types.js"

type BaseConditions<S extends State> = Conditions<ConditionsContextBase<S>>

/**
 * Helper type for `test().test(callback)`
 * where you only need `State` in the context.
 */
export type BaseAssertionTester<S extends State> = Parameters<
  ReturnType<BaseConditions<S>>["test"]
>[0]
