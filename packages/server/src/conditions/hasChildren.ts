import { ServerPlayerEvent } from "../player"
import { ICondition } from "../condition"
import { Entity } from "../entity"
import { State } from "../state"

function hasChildren(entity: Entity): ICondition
function hasChildren(state: State, event: ServerPlayerEvent): boolean
function hasChildren(
  stantity: Entity | State,
  event?: ServerPlayerEvent
): ICondition | boolean {
  if (stantity instanceof Entity) {
    const cond: ICondition = (state: State, event: ServerPlayerEvent) => {
      return stantity.length > 0
    }
    cond._name = `hasChildren{entity}`
    return cond
  } else {
    return event.entity.length > 0
  }
}
hasChildren._name = `hasChildren`

export { hasChildren }
