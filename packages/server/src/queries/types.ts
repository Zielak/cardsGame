import type {
  EntityQuerableProps,
  HelperQuerableProps,
} from "./internalTypes.js"

/**
 * Interface used to search for an entity.
 * An object of props, which appear in every kind of trait and entity, with an addition of:

 * - `parent` - describe the parent of an entity you're looking for
 * - `selected` - query only for selected or not-selected items
 * - `selectionIndex` - query by items selection index, if it was in fact selected
 */
export type QuerableProps = HelperQuerableProps & EntityQuerableProps
