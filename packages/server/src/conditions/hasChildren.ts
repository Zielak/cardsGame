import { ServerPlayerEvent } from "../player"
import { ICondition } from "."
import { State } from "../state"
import { IParent, countChildren } from "../traits/parent"
import { IEntity } from "../traits/entity"

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
    const entity: IEntity = stantity
    const entityHasChildren: ICondition = () =>
      entity.isParent() ? countChildren(entity) > 0 : false

    return entityHasChildren
  } else {
    if (event.entity.isParent()) {
      return countChildren(event.entity) > 0
    }
    return false
  }
}

export { hasChildren }
