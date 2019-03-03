import { State } from "../state"
import { ICondition } from "condition"
import { PlayerEvent } from "player"

/**
 * Target entity is selected in the eyes of the interacting player.
 * @param state
 * @param event
 */
export const isSelected: ICondition = (state: State, event: PlayerEvent) => {
  return event.player.isEntitySelected(event.target)
}
