import { ClientMessageInitialSubjects } from "../interaction/conditions.js"
import type { State } from "../state/state.js"

import type { BaseActionDefinition } from "./base.js"
import type { CollectionActionDefinition } from "./collection.js"
import type { EntityActionDefinition } from "./entityAction.js"
import type { MessageActionDefinition } from "./messageAction.js"

export type ClientMessageContext<S extends State> = {
  state: S
  variant: S["variantData"]
} & ClientMessageInitialSubjects

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
