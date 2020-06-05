import { Player, ServerPlayerEvent } from "../player"
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
   * @returns player's `event` reference
   */
  getEvent(): ServerPlayerEvent {
    return getFlag(this, "event")
  }

  /**
   * @returns `player` reference
   */
  getPlayer(): Player {
    return getFlag(this, "player")
  }

  /**
   * @returns `data` reference from event
   */
  getData(): any {
    return getFlag(this, "data")
  }
}

export { ConditionBase }
