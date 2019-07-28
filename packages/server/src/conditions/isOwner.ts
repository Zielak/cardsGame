import { State } from "../state"
import { ICondition } from "."
import { ServerPlayerEvent } from "../player"
import { getOwner } from "../traits"

/**
 * Is the player an owner of interacted entity
 * @param state
 * @param event
 */
export const isOwner: ICondition = (state: State, event: ServerPlayerEvent) => {
  return getOwner(event.entity) === event.player
}
isOwner._name = "isOwner"
