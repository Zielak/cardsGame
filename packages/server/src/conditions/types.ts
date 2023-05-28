import { State } from "../state/state.js"

/**
 * TODO: figure out a better name...
 */
export type ConditionsContextBase<S extends State> = {
  state: S
  variant: S["variantData"]
}
