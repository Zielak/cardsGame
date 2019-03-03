import { State } from "../state"
import { ICondition } from "condition"
import { PlayerEvent } from "player"

/**
 * Is the player an owner of interacted entity
 * @param state
 * @param event
 */
export const isOwner: ICondition = (state: State, event: PlayerEvent) => {
  return event.target.owner === event.player
}
