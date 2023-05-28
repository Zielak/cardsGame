import type { Command } from "../../command.js"
import type {
  ClientMessageConditions,
  ClientMessageContext,
} from "../../conditions/context/clientMessage.js"
import type { ConditionErrorMessage } from "../../interaction/types.js"
import type { State } from "../../state/state.js"
import type { BaseActionDefinition } from "../base.js"
import type { ActionDefinition } from "../types.js"

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
    // message: ServerPlayerMessage, // less is more?
    messageContext: ClientMessageContext<S>,
    actionContext: CollectionContext<C>
  ): boolean

  checkConditions: (
    con: ClientMessageConditions<S>,
    messageContext: ClientMessageContext<S>,
    actionContext: CollectionContext<C>
  ) => CollectionConditionsResult<BaseActionDefinition<S>>

  getCommand: (
    messageContext: ClientMessageContext<S>,
    actionContext: CollectionContext<C>
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
export type CollectionConditionsResult<
  A extends BaseActionDefinition<any>
  // S extends State
> = Map<A, ConditionErrorMessage>
