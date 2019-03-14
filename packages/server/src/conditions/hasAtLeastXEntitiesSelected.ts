import { State } from "../state"
import { ICondition, IConditionFactory } from "../condition"
import { ServerPlayerEvent } from "../player"

/**
 * Expects the current player to have at least `count` selected entities.
 * Function returns an actual `Condition`
 * @param count X
 */
export const hasAtLeastXEntitiesSelected: IConditionFactory = (
  count: number
): ICondition => {
  const cond: ICondition = (state: State, event: ServerPlayerEvent) =>
    event.player.selectedEntitiesCount >= count
  cond._name = `hasAtLeast(${count})EntitiesSelected`
  return cond
}
