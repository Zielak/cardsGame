import { getFlag, ref, setFlag } from "./utils"

class ConditionBase<S> {
  /**
   * Negates the following assertion.
   */
  get not(): this {
    setFlag(this, "not", true)
    return this
  }

  /**
   * Grabs and returns direct `reference` for a given subject
   */
  grab<T>(refName?: string): T {
    return refName ? ref(this, refName) : getFlag(this, "subject")
  }

  grabState(): S {
    return getFlag(this, "state")
  }
}

export { ConditionBase }
