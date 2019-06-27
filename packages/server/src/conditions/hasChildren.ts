import { ServerPlayerEvent } from "../player"
import { ICondition } from "."
import { State } from "../state"
import { IParent, countChildren } from "../entities/traits/parent"
import { IEntity } from "../entities/traits/entity"

function hasChildren(entity: IParent | IEntity): ICondition
function hasChildren(state: State, event: ServerPlayerEvent): boolean
/**
 * Does specified entity or the one interacted with has any children?
 * @param stantity
 * @param event
 */
function hasChildren(
  stantity: IParent & IEntity | IEntity | State,
  event?: ServerPlayerEvent
): ICondition | boolean {
  if (!(stantity instanceof State)) {
    const cond: ICondition = (state: State, event: ServerPlayerEvent) =>
      stantity.isParent() ? countChildren(stantity) > 0 : false

    cond._name = `hasChildren{entity}`
    return cond
  } else {
    if (event.entity.isParent()) {
      return countChildren(event.entity) > 0
    }
    return false
  }
}
hasChildren._name = `hasChildren`

export { hasChildren }
