import type { QuerableProps } from "../../queries/types.js"
import { State } from "../../state/state.js"
import { ClientMessageContext } from "../types.js"

/**
 * Only "*" is accepted as string.
 */
export type InteractionQueries<S extends State> = (
  messageContext: ClientMessageContext<S>
) => QuerableProps[] | string
