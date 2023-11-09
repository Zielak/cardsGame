import type { Command } from "../../command.js"
import type {
  ClientMessageConditions,
  ClientMessageContext,
} from "../../conditions/context/clientMessage.js"
import { runConditionOnAction } from "../../interaction/runConditionOnAction.js"
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
   *
   * Define as array, if your action can end in multiple places.
   */
  end: DragEndActionTemplate<S> | DragEndActionTemplate<S>[]
}

/**
 * @ignore
 */
export class DragActionDefinition<S extends State>
  implements CollectionActionDefinition<S, DragContext<S>>
{
  name: string
  start: DragStartActionDefinition<S>
  end: DragEndActionDefinition<S>[]

  constructor(private template: DragActionTemplate<S>) {
    this.name = template.name
    this.start = new DragStartActionDefinition(template.start)

    this.end = Array.isArray(template.end)
      ? template.end.map((end) => new DragEndActionDefinition(end))
      : [new DragEndActionDefinition(template.end)]
  }

  setupContext(): DragContext<S> {
    return {
      finished: false,
      prerequisitesFailed: false,
      conditionsFailed: false,
      successfulEnd: new Set(),
    }
  }

  teardownContext(context: CollectionContext<DragContext<S>>): void {
    delete context.finished
    delete context.prerequisitesFailed
    delete context.conditionsFailed
    context.successfulEnd.clear()
    delete context.successfulEnd
  }

  checkPrerequisites(
    messageContext: ClientMessageContext<S>,
    actionContext: CollectionContext<DragContext<S>>,
  ): boolean {
    let result: boolean
    if (actionContext.pending) {
      this.end
        .filter((action) => action.checkPrerequisites(messageContext))
        .forEach((action) => actionContext.successfulEnd.add(action))

      result = actionContext.successfulEnd.size > 0
    } else {
      result = this.start.checkPrerequisites(messageContext)
    }

    actionContext.prerequisitesFailed = !result

    if (actionContext.pending && actionContext.prerequisitesFailed) {
      // Abort, when all ends fail
      actionContext.aborted = true
    }

    return result
  }

  checkConditions(
    con: ClientMessageConditions<S>,
    messageContext: ClientMessageContext<S>,
    actionContext: CollectionContext<DragContext<S>>,
  ): CollectionConditionsResult<BaseActionDefinition<S>> {
    const { interaction, player } = messageContext
    const rejectedActions: CollectionConditionsResult<BaseActionDefinition<S>> =
      new Map()

    if (
      !actionContext.pending &&
      isStartEvent(interaction, player.isTapDragging)
    ) {
      const error = runConditionOnAction(con, messageContext, this.start)
      if (error) {
        rejectedActions.set(this.start, error)
      }
    } else if (
      actionContext.pending &&
      isEndEvent(interaction, player.isTapDragging)
    ) {
      actionContext.successfulEnd.forEach((action) => {
        const error = runConditionOnAction(con, messageContext, action)

        if (error) {
          rejectedActions.set(action, error)
          actionContext.successfulEnd.delete(action)
        }
      })
    }

    if (rejectedActions.size > 0) {
      actionContext.conditionsFailed = true
      actionContext.aborted = true
    }

    return rejectedActions
  }

  getCommand(
    messageContext: ClientMessageContext<S>,
    actionContext: CollectionContext<DragContext<S>>,
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
      return [...actionContext.successfulEnd][0].getCommand(messageContext)
    }
  }

  hasSuccessfulSubActions(context: CollectionContext<DragContext<S>>): boolean {
    return !(context.conditionsFailed || context.prerequisitesFailed)
  }

  hasFinished(context: CollectionContext<DragContext<S>>): boolean {
    return context.finished
  }
}

/**
 * @category Action definitions
 */
export function defineDragAction<S extends State = State>(
  template: DragActionTemplate<S>,
): DragActionDefinition<S> {
  return new DragActionDefinition(template)
}
