import type { Command } from "../../command.js"
import type {
  ClientMessageConditions,
  ClientMessageContext,
} from "../../conditions/context/clientMessage.js"
import { runConditionOnAction } from "../../interaction/runConditionOnAction.js"
import { ConditionErrorMessage } from "../../interaction/types.js"
import type { State } from "../../state/state.js"
import type { BaseActionDefinition } from "../base.js"
import type {
  CollectionActionDefinition,
  CollectionConditionsResult,
  CollectionContext,
} from "../collection/collection.js"

import { DragContext } from "./context.js"
import { DragEndActionTemplate, DragEndActionDefinition } from "./end.js"
import { DragStartActionDefinition, DragStartActionTemplate } from "./start.js"
import { isEndEvent, isStartEvent } from "./utils.js"

/**
 * @category Action definitions
 */
export interface DragActionTemplate<S extends State = State> {
  name: string

  /**
   * Definition for event related to "dragStart"
   */
  start: DragStartActionTemplate<S>

  /**
   * Definition for event related to "dragEnd".
   * Only considered after passing previous "start" action.
   */
  end: DragEndActionTemplate<S>
}

/**
 * @ignore
 */
export class DragActionDefinition<S extends State>
  implements CollectionActionDefinition<S, DragContext>
{
  name: string
  start: DragStartActionDefinition<S>
  end: DragEndActionDefinition<S>

  constructor(private template: DragActionTemplate<S>) {
    this.name = template.name
    this.start = new DragStartActionDefinition(template.start)
    this.end = new DragEndActionDefinition(template.end)
  }

  setupContext(): DragContext {
    return {
      finished: false,
      prerequisitesFailed: false,
      conditionsFailed: false,
    }
  }

  teardownContext(context: CollectionContext<DragContext>): void {
    delete context.finished
    delete context.prerequisitesFailed
    delete context.conditionsFailed
  }

  checkPrerequisites(
    messageContext: ClientMessageContext<S>,
    actionContext: CollectionContext<DragContext>
  ): boolean {
    const result = actionContext.pending
      ? this.end.checkPrerequisites(messageContext)
      : this.start.checkPrerequisites(messageContext)

    actionContext.prerequisitesFailed = !result

    if (actionContext.pending && actionContext.prerequisitesFailed) {
      // Abort, when end failed
      actionContext.aborted = true
    }

    return result
  }

  checkConditions(
    con: ClientMessageConditions<S>,
    messageContext: ClientMessageContext<S>,
    actionContext: CollectionContext<DragContext>
  ): CollectionConditionsResult<BaseActionDefinition<S>> {
    const { interaction, player } = messageContext
    let error: ConditionErrorMessage

    if (
      !actionContext.pending &&
      isStartEvent(interaction, player.isTapDragging)
    ) {
      error = runConditionOnAction(con, messageContext, this.start)
      if (error) {
        actionContext.conditionsFailed = true
        return new Map([[this.start, error]])
      }
    } else if (
      actionContext.pending &&
      isEndEvent(interaction, player.isTapDragging)
    ) {
      error = runConditionOnAction(con, messageContext, this.end)
      if (error) {
        actionContext.conditionsFailed = true
        return new Map([[this.end, error]])
      }
    }
  }

  getCommand(
    messageContext: ClientMessageContext<S>,
    actionContext: CollectionContext<DragContext>
  ): Command<State> {
    const { interaction, player } = messageContext

    if (
      !actionContext.pending &&
      isStartEvent(interaction, player.isTapDragging)
    ) {
      return this.start.getCommand(messageContext)
    } else if (
      actionContext.pending &&
      isEndEvent(interaction, player.isTapDragging)
    ) {
      actionContext.finished = true
      return this.end.getCommand(messageContext)
    }
  }

  hasSuccessfulSubActions(context: CollectionContext<DragContext>): boolean {
    return !(context.conditionsFailed || context.prerequisitesFailed)
  }

  hasFinished(context: CollectionContext<DragContext>): boolean {
    return context.finished
  }
}

/**
 * @category Action definitions
 */
export function defineDragAction<S extends State = State>(
  template: DragActionTemplate<S>
): DragActionDefinition<S> {
  return new DragActionDefinition(template)
}
