import { ClientMessageContext } from "../../conditions/context/clientMessage.js"
import type { QuerableProps } from "../../queries/types.js"
import { State } from "../../state/state.js"

/**
 * Only "*" is accepted as string.
 */
export type InteractionQueries<S extends State> = (
  messageContext: ClientMessageContext<S>
) => QuerableProps[] | string
