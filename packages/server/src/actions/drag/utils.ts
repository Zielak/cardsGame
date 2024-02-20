import { ServerLogger } from "@cardsgame/utils"
import chalk from "chalk"

import { State } from "../../state/state.js"

import { DragActionDefinition, DragActionTemplate } from "./dragAction.js"

export const tapFallbackLog = new ServerLogger(
  "tapFallback",
  true,
  chalk.yellowBright,
)

/**
 * @ignore
 */
export function isDragActionTemplate<S extends State = State>(
  o: unknown,
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
export function isDragActionDefinition<S extends State>(
  o: unknown,
): o is DragActionDefinition<S> {
  if (typeof o !== "object" && !(o instanceof DragActionDefinition)) {
    return false
  }

  const templateMatches = "template" in o && isDragActionTemplate(o["template"])

  return templateMatches
}

export function isStartEvent(
  interaction: InteractionType,
  isTapDragging: boolean,
): boolean {
  return (
    interaction === "dragstart" || (interaction === "tap" && !isTapDragging)
  )
}

export function isEndEvent(
  interaction: InteractionType,
  isTapDragging: boolean,
): boolean {
  return interaction === "dragend" || (interaction === "tap" && isTapDragging)
}
