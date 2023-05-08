import type { State } from "../state/state.js"

import type { BaseActionDefinition } from "./base.js"
import type { CollectionActionDefinition } from "./collection.js"
import type { EntityActionDefinition } from "./entityAction.js"
import type { MessageActionDefinition } from "./messageAction.js"

/**
 * @ignore
 * @deprecated use
 */
export type BasicActionDefinition<S extends State> =
  | EntityActionDefinition<S>
  | MessageActionDefinition<S>

/**
 * @ignore
 */
export type ActionDefinition<S extends State = State> =
  | CollectionActionDefinition<S>
  | BaseActionDefinition<S>
