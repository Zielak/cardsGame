import { State } from "../state"
import { ServerPlayerEvent } from "../player"
import { ICondition, IConditionFactory } from "."

export const entitiesNameIs: IConditionFactory = (name: string) => {
  const cond: ICondition = (
    state: State,
    event: ServerPlayerEvent
  ): boolean => {
    return event.entity.name === name
  }
  cond._name = "entitiesNameIs"
  return cond
}
