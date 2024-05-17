import { getFlag, getRef, setFlag } from "./utils.js"

class ConditionBase<S> {
  /**
   * Negates the following assertion.
   */
  get not(): this {
    setFlag(this, "not", true)
    return this
  }

  /**
   * Grabs and returns current `subject` or a reference to subject remembered by `refName`.
   * @example
   * Combine together with `query()` to grab reference to an entity:
   * ```ts
   * const pile = test().query({ type: "pile" }).grab()
   * ```
   * @example
   * grab previously remembered entity:
   * ```ts
   * test().remember("pile", { type: "pile" })
   * const pile = test().grab("pile")
   * ```
   */
  grab<T>(refName?: string): T {
    return refName ? getRef(this, refName) : getFlag(this, "subject")
  }

  /**
   * @deprecated you can just grab state from context
   * @returns State related with this Conditions instance.
   */
  grabState(): S {
    return getFlag(this, "state")
  }
}

export { ConditionBase }
