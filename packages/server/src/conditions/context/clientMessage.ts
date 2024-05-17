import { ServerPlayerMessage } from "../../player/serverPlayerMessage.js"
import { State } from "../../state/state.js"
import { Conditions } from "../conditions.js"
import { ConditionsContextBase } from "../types.js"

export type ClientMessageInitialSubjects = Omit<
  ServerPlayerMessage,
  "entityPath" | "timestamp" | "draggedEntity"
>

export type ClientMessageContext<S extends State> =
  ClientMessageInitialSubjects & ConditionsContextBase<S>

export type ClientMessageConditions<S extends State> = Conditions<
  ClientMessageContext<S>
>

/**
 * Helper type for `test().test(callback)` related to client message.
 * Brings context filled with interaction data.
 */
export type ClientMessageAssertionTester<S extends State> = Parameters<
  ReturnType<ClientMessageConditions<S>>["test"]
>[0]

/**
 * For internal usage only, used also by server-testing lib
 * @ignore
 */
export const playerMessageToInitialSubjects = (
  message: ServerPlayerMessage,
): ClientMessageInitialSubjects => {
  const initialSubjects = Object.keys(message)
    .filter((key) => !["timestamp"].includes(key))
    .reduce((o, key) => {
      o[key] = message[key]
      return o
    }, {} as ClientMessageInitialSubjects)

  return initialSubjects
}
