import { ServerPlayerEvent } from "../../players/player"
import { getFlag } from "../base/utils"

class InteractionConditionBase {
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

export { InteractionConditionBase }
