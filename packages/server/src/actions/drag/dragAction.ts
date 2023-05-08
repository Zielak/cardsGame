import { chalk, Logs } from "@cardsgame/utils"

import type { Command } from "../../command.js"
import type {
  ClientMessageConditions,
  ClientMessageInitialSubjects,
} from "../../interaction/conditions.js"
import { runConditionOnAction } from "../../interaction/runConditionOnAction.js"
import type { ServerPlayerMessage } from "../../player/serverPlayerMessage.js"
import type { State } from "../../state/state.js"
import type { BaseActionDefinition } from "../base.js"
import type {
  CollectionActionDefinition,
  CollectionConditionsResult,
  CollectionContext,
} from "../collection.js"

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
    message: ServerPlayerMessage,
    context: CollectionContext<DragContext>
  ): boolean {
    const result = context.pending
      ? this.end.checkPrerequisites(message)
      : this.start.checkPrerequisites(message)

    context.prerequisitesFailed = !result

    if (context.pending && context.prerequisitesFailed) {
      // Abort, when end failed
      context.aborted = true
    }

    return result
  }

  checkConditions(
    con: ClientMessageConditions<S>,
    initialSubjects: ClientMessageInitialSubjects,
    context: CollectionContext<DragContext>
  ): CollectionConditionsResult<BaseActionDefinition<S>> {
    const { interaction, player } = initialSubjects
    let error

    if (!context.pending && isStartEvent(interaction, player.isTapDragging)) {
      error = runConditionOnAction(con, initialSubjects, this.start)
    } else if (
      context.pending &&
      isEndEvent(interaction, player.isTapDragging)
    ) {
      error = runConditionOnAction(con, initialSubjects, this.end)
    }

    if (error) {
      context.conditionsFailed = true
      return new Map([error])
    }
  }

  getCommand(
    state: S,
    event: ServerPlayerMessage,
    context: CollectionContext<DragContext>
  ): Command<State> {
    const { interaction, player } = event

    if (!context.pending && isStartEvent(interaction, player.isTapDragging)) {
      return this.start.getCommand(state, event)
    } else if (
      context.pending &&
      isEndEvent(interaction, player.isTapDragging)
    ) {
      context.finished = true
      return this.end.getCommand(state, event)
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
