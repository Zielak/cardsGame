import { ServerPlayerEvent, Player } from "../player"

import { flag } from "./utils"

class ConditionBase<S> {
  /**
   * Negates the following assertion.
   */
  get not(): this {
    flag(this, "not", true)
    return this
  }

  /**
   * @returns `state` reference
   */
  getState(): S {
    return flag(this, "state")
  }

  /**
   * @returns player's `event` reference
   */
  getEvent(): ServerPlayerEvent {
    return flag(this, "event")
  }

  /**
   * @returns `player` reference
   */
  getPlayer(): Player {
    return flag(this, "player")
  }
}

export { ConditionBase }
