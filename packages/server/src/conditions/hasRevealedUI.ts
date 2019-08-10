import { ICondition } from "."
import { State } from "../state"
import { ServerPlayerEvent } from "../player"

/**
 * Is client currently presented with specific UI?
 * @param names
 */
export const hasRevealedUI = (names: string | string[]) => {
  const uiNames = Array.isArray(names) ? names : [names]

  const hasRevealedUI: ICondition = (
    state: State,
    event: ServerPlayerEvent
  ) => {
    return uiNames.some(uiName => {
      return state.ui[uiName] === event.player.clientID
    })
  }

  return hasRevealedUI
}
