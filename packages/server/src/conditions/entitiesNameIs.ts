import { State } from "../state"
import { ServerPlayerEvent } from "../player"
import { ICondition } from "."

export const entitiesNameIs = (name: string) => {
  const entitiesNameIs: ICondition = (
    state: State,
    event: ServerPlayerEvent
  ): boolean => {
    return event.entity.name === name
  }

  return entitiesNameIs
}
