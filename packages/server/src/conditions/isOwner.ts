import { State } from "../state"
import { ICondition } from "../condition"
import { ServerPlayerEvent } from "../player"

/**
 * Is the player an owner of interacted entity
 * @param state
 * @param event
 */
export const isOwner: ICondition = (state: State, event: ServerPlayerEvent) => {
  return event.target.owner === event.player
}
isOwner._name = "isOwner"
