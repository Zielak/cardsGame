import type { State } from "../../state/state.js"

import type { CollectionActionDefinition } from "./collection.js"

/**
 * @ignore
 */
export function extendsCollectionActionDefinition<S extends State>(
  o: unknown
): o is CollectionActionDefinition<S> {
  return (
    typeof o === "object" &&
    ["setupContext", "teardownContext", "hasSuccessfulSubActions"].every(
      (m) => m in o && typeof o[m] === "function"
    )
  )
}
