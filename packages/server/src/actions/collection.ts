import type { Command } from "../command.js"
import type {
  ClientMessageConditions,
  ClientMessageInitialSubjects,
} from "../interaction/conditions.js"
import type { ConditionErrorMessage } from "../interaction/types.js"
import type { ServerPlayerMessage } from "../player/serverPlayerMessage.js"
import type { State } from "../state/state.js"

import type { BaseActionDefinition } from "./base.js"
import type { ActionDefinition } from "./types.js"

export interface CollectionContext<S extends State>
  extends Record<string, unknown> {
  successfulActions: Set<ActionDefinition<S>>
}

export interface ActionsCollection<
  S extends State,
  C extends CollectionContext<S> = {
    successfulActions: Set<ActionDefinition<S>>
  }
> {
  name: string
  // actions: readonly ActionDefinition<S>[]

  setupContext: () => C
  teardownContext: (context: C) => void

  /**
   * Should run checks against interaction in interactionAction etc
   */
  checkPrerequisites(message: ServerPlayerMessage, context: C): boolean

  checkConditions: (
    con: ClientMessageConditions<S>,
    initialSubjects: ClientMessageInitialSubjects,
    context: C
  ) => CollectionConditionsResult<BaseActionDefinition<S>, S>

  getCommand: (state: S, event: ServerPlayerMessage, context: C) => Command<S>

  allActionsCount: () => number

  successfulActionsCount: (context: C) => number
  hasFinished: (context: C) => boolean
}

export type CollectionConditionsResult<
  A extends BaseActionDefinition<S>,
  S extends State
> = Map<A, ConditionErrorMessage>
