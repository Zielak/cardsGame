import type { State } from "../../state/state.js"
import { EntityActionDefinition } from "../entity/entityAction.js"
import { isEntityActionDefinition } from "../entity/utils.js"
import { MessageActionDefinition } from "../message/messageAction.js"
import { isMessageActionDefinition } from "../message/utils.js"

export type CompoundActionChild<S extends State> =
  | EntityActionDefinition<S>
  | MessageActionDefinition<S>

/**
 * @ignore
 */
export function canActionBeInCompound<S extends State>(
  o: unknown
): o is CompoundActionChild<S> {
  return isEntityActionDefinition(o) || isMessageActionDefinition(o)
}
