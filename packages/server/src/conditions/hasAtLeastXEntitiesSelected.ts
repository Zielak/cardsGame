import { State } from "../state"
import { ICondition } from "../condition"
import { ServerPlayerEvent } from "../player"

/**
 * Expects the current player to have at least `count` selected entities.
 * Function returns an actual `Condition`
 * @param count X
 */
export const hasAtLeastXEntitiesSelected = (count: number): ICondition => (
  state: State,
  event: ServerPlayerEvent
) => event.player.selectedEntitiesCount >= count
