import { State } from "../../state/state.js"

import {
  MessageActionDefinition,
  MessageActionTemplate,
} from "./messageAction.js"

/**
 * @ignore
 */
export function isMessageActionTemplate<S extends State>(
  o: unknown
): o is MessageActionTemplate<S> {
  if (typeof o !== "object") {
    return false
  }

  return "messageType" in o && typeof o["messageType"] === "string"
}

/**
 * @ignore
 */
export function isMessageActionDefinition<S extends State>(
  o: unknown
): o is MessageActionDefinition<S> {
  if (typeof o !== "object" && !(o instanceof MessageActionDefinition)) {
    return false
  }

  const templateMatches =
    "template" in o && isMessageActionTemplate(o["template"])

  return templateMatches
}
