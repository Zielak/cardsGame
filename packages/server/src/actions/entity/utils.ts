import { State } from "@/state/state.js"

import { EntityActionDefinition, EntityActionTemplate } from "./entityAction.js"

/**
 * @ignore
 */
export function isEntityActionDefinition<S extends State>(
  o: unknown,
): o is EntityActionDefinition<S> {
  if (typeof o !== "object" && !(o instanceof EntityActionDefinition)) {
    return false
  }

  const templateMatches =
    "template" in o && isEntityActionTemplate(o["template"])

  return templateMatches
}

function validInteractionType(v: unknown): v is InteractionType {
  return typeof v === "string" && ["tap", "dragend"].some((type) => v === type)
}

/**
 * @ignore
 */
export function isEntityActionTemplate<S extends State = State>(
  o: unknown,
): o is EntityActionTemplate<S> {
  if (typeof o !== "object") {
    return false
  }

  const hasInteractionField =
    "interaction" in o && typeof o["interaction"] === "function"

  const hasValidInteractionTypeField =
    "interactionType" in o ? validInteractionType(o["interactionType"]) : true

  return hasInteractionField && hasValidInteractionTypeField
}
