import type { State } from "@/state/state.js"

import type { CollectionActionDefinition } from "./collection.js"

/**
 * For internal usage only, used also by server-testing lib
 * @ignore
 */
export function extendsCollectionActionDefinition<S extends State>(
  o: unknown,
): o is CollectionActionDefinition<S> {
  return (
    typeof o === "object" &&
    ["setupContext", "teardownContext", "hasSuccessfulSubActions"].every(
      (m) => m in o && typeof o[m] === "function",
    )
  )
}
