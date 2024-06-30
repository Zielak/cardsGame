import { State } from "@/state/state.js"

import { ConditionsContextBase } from "../types.js"

/**
 * For internal usage only, used also by server-testing lib
 * @ignore
 */
export const prepareConditionsContext = <
  S extends State = State,
  I extends Record<string, unknown> = Record<string, unknown>,
>(
  state: S,
  initialSubjects?: I,
): I & ConditionsContextBase<S> => {
  return {
    state,
    variant: state.variantData,
    ...initialSubjects,
  }
}
