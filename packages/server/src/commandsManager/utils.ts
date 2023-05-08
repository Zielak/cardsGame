import type {
  CollectionActionDefinition,
  CollectionContext,
} from "../actions/collection.js"
import type { State } from "../state/state.js"

/**
 * @ignore
 */
export function prepareContext<
  C extends Record<string, unknown> = Record<string, unknown>
>(action: CollectionActionDefinition<State>): CollectionContext<C> {
  return {
    ...action.setupContext(),
    pending: false,
  } as CollectionContext<C>
}
