import { State } from "../state"
import { ICondition } from "../condition"
import { ServerPlayerEvent } from "../player"

/**
 * Target entity is selected in the eyes of the interacting player.
 * @param state
 * @param event
 */
export const isSelected: ICondition = (
  state: State,
  event: ServerPlayerEvent
) => {
  return event.player.isEntitySelected(event.entity)
}
isSelected._name = "isSelected"
