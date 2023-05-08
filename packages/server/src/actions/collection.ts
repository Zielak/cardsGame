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

export type CollectionContext<
  C extends Record<string, unknown> = Record<string, unknown>
> = {
  /**
   * Controlled by manager, marks if this instance of action
   * is marked as `pending` for the player
   * @readonly please
   */
  pending: boolean

  /**
   * Change to `false` to remove this action from `pending`.
   */
  aborted: boolean
} & C

/**
 * @ignore
 */
export interface CollectionActionDefinition<
  S extends State,
  C extends Record<string, unknown> = Record<string, unknown>
> {
  name: string

  setupContext: () => C
  teardownContext: (context: CollectionContext<C>) => void

  /**
   * Should run checks against interaction in interactionAction etc
   */
  checkPrerequisites(
    message: ServerPlayerMessage,
    context: CollectionContext<C>
  ): boolean

  checkConditions: (
    con: ClientMessageConditions<S>,
    initialSubjects: ClientMessageInitialSubjects,
    context: CollectionContext<C>
  ) => CollectionConditionsResult<BaseActionDefinition<S>>

  getCommand: (
    state: S,
    event: ServerPlayerMessage,
    context: CollectionContext<C>
  ) => Command<S>

  hasSuccessfulSubActions: (context: CollectionContext<C>) => boolean

  /**
   * Return `false` if this action should be marked as pending, and be the
   * only one for evaluation in subsequent player's events?
   */
  hasFinished: (context: CollectionContext<C>) => boolean

  /**
   * Only used for debugging, for logs
   */
  _allActionsCount?: () => number
  /**
   * Only used for debugging, for logs
   */
  _successfulActionsCount?: (context: CollectionContext<C>) => number

  /**
   * @deprecated figure out if needed...
   */
  getSuccessfulAction?: (context: CollectionContext<C>) => ActionDefinition<S>
}

/**
 * @ignore
 */
export function extendsCollectionActionDefinition<S extends State>(
  o: unknown
): o is CollectionActionDefinition<S> {
  return (
    typeof o === "object" &&
    ["setupContext", "teardownContext", "hasSuccessfulSubActions"].every(
      (m) => m in o && typeof o[m] === "function"
    )
  )
}

/**
 * @ignore
 */
export type CollectionConditionsResult<
  A extends BaseActionDefinition<any>
  // S extends State
> = Map<A, ConditionErrorMessage>
