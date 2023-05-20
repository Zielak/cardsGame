import { ClientMessageContext } from "../actions/types.js"
import { ServerPlayerMessage } from "../player/serverPlayerMessage.js"
import { State } from "../state/state.js"

import { ClientMessageInitialSubjects } from "./conditions.js"

export const playerMessageToInitialSubjects = (
  message: ServerPlayerMessage
): ClientMessageInitialSubjects => {
  const initialSubjects = Object.keys(message)
    .filter((key) => !["timestamp"].includes(key))
    .reduce((o, key) => {
      o[key] = message[key]
      return o
    }, {} as ClientMessageInitialSubjects)

  return initialSubjects
}

export const prepareClientMessageContext = <S extends State>(
  state: S,
  initialSubjects?: ClientMessageInitialSubjects
): ClientMessageContext<S> => {
  return {
    state,
    variant: state.variantData,
    ...initialSubjects,
  }
}
