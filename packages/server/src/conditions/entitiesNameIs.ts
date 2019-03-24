import { State } from "../state"
import { ServerPlayerEvent } from "../player"

export const entitiesNameIs = (name: string) => {
  const cond = (state: State, event: ServerPlayerEvent): boolean => {
    return event.entity.name === name
  }
  cond._name = "entitiesNameIs"
  return cond
}
