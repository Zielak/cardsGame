import { Player, ServerPlayerEvent } from "../players/player"
import { getFlag, setFlag } from "./utils"

class ConditionBase<S> {
  /**
   * Negates the following assertion.
   */
  get not(): this {
    setFlag(this, "not", true)
    return this
  }

  // TODO: Deprecate these super-specific getters into something generic: con.entity.ref() ?

  /**
   * @returns `state` reference
   */
  getState(): S {
    return getFlag(this, "state")
  }

  /**
   * @returns current `subject`
   */
  getSubject(): any {
    return getFlag(this, "subject")
  }

  /**
   * @returns `player` reference
   */
  getPlayer(): Player {
    return getFlag(this, "player")
  }

  /**
   * @returns player's `event` reference
   */
  getEvent(): ServerPlayerEvent {
    return getFlag(this, "event")
  }

  /**
   * @returns `data` reference from event
   */
  getData(): any {
    return getFlag(this, "data")
  }
}

export { ConditionBase }
