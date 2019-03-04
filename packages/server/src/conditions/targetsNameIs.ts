import { State } from "../state"
import { IConditionFactory } from "../condition"
import { ServerPlayerEvent } from "../player"

export const targetsNameIs: IConditionFactory = (name: string) => (
  state: State,
  event: ServerPlayerEvent
): boolean => {
  return event.target.name === name
}
