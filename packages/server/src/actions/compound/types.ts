import type { State } from "../../state/state.js"
import {
  EntityActionDefinition,
  isEntityActionDefinition,
} from "../entityAction.js"
import {
  MessageActionDefinition,
  isMessageActionDefinition,
} from "../messageAction.js"

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
