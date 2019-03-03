import { State } from "state"
import { PlayerEvent } from "player"

export interface ICondition {
  (state: State, event: PlayerEvent): boolean
}
export type IConditionFactory = (...args: any) => ICondition
