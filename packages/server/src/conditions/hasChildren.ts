import { ServerPlayerEvent } from "../player"
import { ICondition } from "../condition"
import { State } from "../state"
import { IParent, countChildren } from "../entities/traits/parent"

function hasChildren(entity: IParent): ICondition
function hasChildren(state: State, event: ServerPlayerEvent): boolean
function hasChildren(
  stantity: IParent | State,
  event?: ServerPlayerEvent
): ICondition | boolean {
  if (!(stantity instanceof State)) {
    const cond: ICondition = (state: State, event: ServerPlayerEvent) => {
      return countChildren(stantity) > 0
    }
    cond._name = `hasChildren{entity}`
    return cond
  } else {
    return countChildren(event.entity as IParent) > 0
  }
}
hasChildren._name = `hasChildren`

export { hasChildren }
