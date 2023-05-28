import { State } from "../../state/state.js"

import { RootActionDefinition } from "./rootAction.js"

/**
 * @ignore
 */
export function isRootActionDefinition<S extends State>(
  o: unknown
): o is RootActionDefinition<S> {
  if (typeof o !== "object" && !(o instanceof RootActionDefinition)) {
    return false
  }

  const nameIsValid = "name" in o && o["name"] === "root"

  const hasActions = "actions" in o && Array.isArray(o["actions"])

  return nameIsValid && hasActions
}
