import { chalk, Logs } from "@cardsgame/utils"

import type { Command } from "../../command.js"
import type {
  ClientMessageConditions,
  ClientMessageInitialSubjects,
} from "../../interaction/conditions.js"
import type { ServerPlayerMessage } from "../../player/serverPlayerMessage.js"
import type { State } from "../../state/state.js"
import type { BaseActionDefinition } from "../base.js"

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
export class DragActionDefinition<S extends State>
  implements BaseActionDefinition<S>
{
  name: string
  start: DragStartActionDefinition<S>
  end: DragEndActionDefinition<S>

  constructor(private template: DragActionTemplate<S>) {
    this.name = template.name
    this.start = new DragStartActionDefinition(template.start)
    this.end = new DragEndActionDefinition(template.end)
  }

  checkPrerequisites(message: ServerPlayerMessage): boolean {
    return (
      this.end.checkPrerequisites(message) ||
      this.start.checkPrerequisites(message)
    )
  }

  checkConditions(
    con: ClientMessageConditions<S>,
    initialSubjects: ClientMessageInitialSubjects
  ): void {
    const { interaction, player } = initialSubjects

    if (isStartEvent(interaction, player.isTapDragging)) {
      return this.start.checkConditions(con, initialSubjects)
    } else if (isEndEvent(interaction, player.isTapDragging)) {
      return this.end.checkConditions(con, initialSubjects)
    }
  }

  getCommand(state: S, event: ServerPlayerMessage): Command<State> {
    const { interaction, player } = event

    if (isStartEvent(interaction, player.isTapDragging)) {
      return this.start.getCommand(state, event)
    } else if (isEndEvent(interaction, player.isTapDragging)) {
      return this.end.getCommand(state, event)
    }
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
