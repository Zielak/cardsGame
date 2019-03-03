import { State } from "../state"
import { IConditionFactory } from "condition"
import { PlayerEvent } from "player"

export const targetsNameIs: IConditionFactory = (name: string) => (
  state: State,
  event: PlayerEvent
): boolean => {
  return event.target.name === name
}
