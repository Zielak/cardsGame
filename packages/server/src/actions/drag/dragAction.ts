import { chalk, Logs } from "@cardsgame/utils"

import type { Command } from "../../command.js"
import type { ClientMessageConditions } from "../../interaction/conditions.js"
import { runConditionOnAction } from "../../interaction/runConditionOnAction.js"
import type { State } from "../../state/state.js"
import type { BaseActionDefinition } from "../base.js"
import type {
  CollectionActionDefinition,
  CollectionConditionsResult,
  CollectionContext,
} from "../collection.js"
import { ClientMessageContext } from "../types.js"

import { DragEndActionTemplate, DragEndActionDefinition } from "./end.js"
import { DragStartActionDefinition, DragStartActionTemplate } from "./start.js"

export const tapFallbackLog = new Logs("tapFallback", true, {
  serverStyle: chalk.yellowBright,
})

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
export function isDragActionTemplate<S extends State = State>(
  o: unknown
): o is DragActionTemplate<S> {
  if (typeof o !== "object") {
    return false
  }

  const optionalStartCommand =
    "start" in o && typeof o["start"] === "object" && "command" in o["start"]
      ? typeof o["start"]["command"] === "function"
      : true

  const hasValidStart =
    "start" in o &&
    typeof o["start"] === "object" &&
    typeof o["start"]["interaction"] === "function" &&
    typeof o["start"]["conditions"] === "function" &&
    optionalStartCommand

  const hasValidEnd =
    "end" in o &&
    typeof o["end"] === "object" &&
    typeof o["end"]["interaction"] === "function" &&
    typeof o["end"]["conditions"] === "function" &&
    typeof o["end"]["command"] === "function"

  return hasValidStart && hasValidEnd
}

/**
 * @ignore
 */
export type DragContext = {
  finished: boolean
  prerequisitesFailed: boolean
  conditionsFailed: boolean
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
    let error

    if (
      !actionContext.pending &&
      isStartEvent(interaction, player.isTapDragging)
    ) {
      error = runConditionOnAction(con, messageContext, this.start)
    } else if (
      actionContext.pending &&
      isEndEvent(interaction, player.isTapDragging)
    ) {
      error = runConditionOnAction(con, messageContext, this.end)
    }

    if (error) {
      actionContext.conditionsFailed = true
      return new Map([error])
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
    return !context.conditionsFailed && !context.prerequisitesFailed
  }

  hasFinished(context: CollectionContext<DragContext>): boolean {
    return context.finished
  }
}

function isStartEvent(
  interaction: InteractionType,
  isTapDragging: boolean
): boolean {
  return (
    interaction === "dragstart" || (interaction === "tap" && !isTapDragging)
  )
}

function isEndEvent(
  interaction: InteractionType,
  isTapDragging: boolean
): boolean {
  return interaction === "dragend" || (interaction === "tap" && isTapDragging)
}

/**
 * @ignore
 */
export function isDragActionDefinition<S extends State>(
  o: unknown
): o is DragActionDefinition<S> {
  if (typeof o !== "object" && !(o instanceof DragActionDefinition)) {
    return false
  }

  const templateMatches = "template" in o && isDragActionTemplate(o["template"])

  return templateMatches
}

/**
 * @category Action definitions
 */
export function defineDragAction<S extends State = State>(
  template: DragActionTemplate<S>
): DragActionDefinition<S> {
  return new DragActionDefinition(template)
}
