import type { State } from "../state/state.js"

import type { ActionsCollection } from "./collection.js"
import {
  CompoundActionDefinition,
  isCompoundActionDefinition,
  isCompoundActionDefinition_quick,
} from "./compoundAction.js"
import { DragActionDefinition, isDragActionDefinition } from "./dragAction.js"
import {
  EntityActionDefinition,
  isEntityActionDefinition,
} from "./entityAction.js"
import {
  isMessageActionDefinition,
  MessageActionDefinition,
} from "./messageAction.js"
import { isRootActionDefinition } from "./rootAction.js"

/**
 * @ignore
 */
export type BasicActionDefinition<S extends State> =
  | EntityActionDefinition<S>
  | MessageActionDefinition<S>
  | DragActionDefinition<S>

/**
 * @ignore
 */
export type ActionDefinition<S extends State = State> =
  | CompoundActionDefinition<S>
  | EntityActionDefinition<S>
  | MessageActionDefinition<S>
  | DragActionDefinition<S>

/**
 * @ignore
 */
export function isBasicActionDefinition<S extends State>(
  o: unknown
): o is BasicActionDefinition<S> {
  return (
    isEntityActionDefinition(o) ||
    isMessageActionDefinition(o) ||
    isDragActionDefinition(o)
  )
}

/**
 * @ignore
 */
export function isActionsCollection<S extends State>(
  o: unknown
): o is ActionsCollection<S> {
  return isRootActionDefinition<S>(o) || isCompoundActionDefinition<S>(o)
}

/**
 * @ignore
 */
export function isActionsCollection_quick<S extends State>(
  o: unknown
): o is ActionsCollection<S> {
  return o["name"] === "root" || isCompoundActionDefinition_quick<S>(o)
}
