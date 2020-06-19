import { Player } from "../../players/player"
import { getFlag, setFlag } from "./utils"

class ConditionBase<S> {
  /**
   * Negates the following assertion.
   */
  get not(): this {
    setFlag(this, "not", true)
    return this
  }

  /**
   * @returns `state` reference
   */
  getState(): S {
    return getFlag(this, "state")
  }

  /**
   * @returns `player` reference
   */
  getPlayer(): Player {
    return getFlag(this, "player")
  }
}

export { ConditionBase }
