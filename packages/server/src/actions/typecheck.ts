import type { State } from "../state/state.js"

import type { ActionTemplate } from "./actionTemplate.js"
import type { BaseActionTemplate } from "./baseTemplate.js"

interface EntitiesActionTemplate<S extends State>
  extends BaseActionTemplate<S> {
  interaction: Required<ActionTemplate<S>["interaction"]>
  interactionType: ActionTemplate<S>["interactionType"]
  messageType: "EntityInteraction"
}

interface EventActionTemplate<S extends State> extends BaseActionTemplate<S> {
  messageType: ActionTemplate<S>["messageType"]
}

/**
 * @ignore
 */
export function isInteractionOfEntities<S extends State = any>(
  o: unknown
): o is EntitiesActionTemplate<S> {
  return (
    typeof o === "object" &&
    "interaction" in o &&
    typeof o["interaction"] === "function"
  )
}

/**
 * @ignore
 */
export function isInteractionOfEvent<S extends State = any>(
  o: unknown
): o is EventActionTemplate<S> {
  const doesNotHaveInteraction = typeof o === "object" && !("interaction" in o)
  const hasNonInteractionMessage =
    typeof o === "object" &&
    "messageType" in o &&
    typeof o["messageType"] === "string" &&
    o["messageType"] !== "EntityInteraction"

  return doesNotHaveInteraction && hasNonInteractionMessage
}
