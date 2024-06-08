import { type State } from "@/state/state.js"

import { type DragEndActionDefinition } from "./end.js"

/**
 * @ignore
 */
export type DragContext<S extends State> = {
  finished: boolean
  prerequisitesFailed: boolean
  conditionsFailed: boolean
  successfulEnd: Set<DragEndActionDefinition<S>>
}
