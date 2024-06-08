import type {
  CollectionActionDefinition,
  CollectionContext,
} from "@/actions/collection/collection.js"
import type { State } from "@/state/state.js"

/**
 * For internal usage only, used also by server-testing lib
 * @ignore
 */
export function prepareActionContext<
  C extends Record<string, unknown> = Record<string, unknown>,
>(action: CollectionActionDefinition<State>): CollectionContext<C> {
  return {
    ...action.setupContext(),
    pending: false,
  } as CollectionContext<C>
}
