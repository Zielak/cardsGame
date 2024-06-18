import type { State } from "@/state/state.js"

import type { BaseActionDefinition, BaseActionTemplate } from "./base.js"
import type { CollectionActionDefinition } from "./collection/collection.js"

/**
 * @ignore
 */
export type ActionDefinition<S extends State = State> =
  | CollectionActionDefinition<S>
  | BaseActionDefinition<S>

export type ActionTemplateConditions<S extends State> =
  BaseActionTemplate<S>["conditions"]
export type ActionTemplateCommand<S extends State> =
  BaseActionTemplate<S>["command"]
