import { chalk, logs } from "@cardsgame/utils"

import type { ActionTemplate } from "../actions/actionTemplate.js"
import { getCustomError } from "../conditions/errors.js"
import type { ServerPlayerMessage } from "../player/serverPlayerMessage.js"
import type { State } from "../state/state.js"

import {
  ClientMessageConditions,
  ClientMessageInitialSubjects,
} from "./conditions.js"
import type { ConditionErrorMessage } from "./types.js"

/**
 * Used internally and in `@cardsgame/server-testing` package.
 * Not for public usage
 * @ignore
 * @returns error message if it doesn't pass. Stays silent if its okay.
 */
export const runConditionsOnAction = <S extends State>(
  state: S,
  message: ServerPlayerMessage,
  action: ActionTemplate<S>
): ConditionErrorMessage => {
  logs.group(`action: ${chalk.white(action.name)}`)

  const initialSubjects = Object.keys(message)
    .filter((key) => !["timestamp", "entities", "entityPath"].includes(key))
    .reduce((o, key) => {
      o[key] = message[key]
      return o
    }, {} as ClientMessageInitialSubjects)

  const conditionsChecker = new ClientMessageConditions<S>(
    state,
    initialSubjects
  )

  let result = true
  let debugErrorMessage = ""
  try {
    action.conditions(conditionsChecker)
  } catch (e) {
    result = false
    debugErrorMessage = (e as Error).message
    logs.debug("\t", debugErrorMessage)
  }

  logs.groupEnd(
    `result: ${result ? chalk.green(result) : chalk.yellow(result)}`
  )

  if (!result) {
    const customMessage = getCustomError(conditionsChecker.getCore())

    return {
      internal: !customMessage,
      message: customMessage ?? debugErrorMessage,
    }
  }
}
