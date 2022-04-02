import { chalk, logs } from "@cardsgame/utils"

import type { ActionTemplate } from "../actionTemplate"
import { getCustomError } from "../conditions/errors"
import type { ServerPlayerMessage } from "../player"
import type { State } from "../state"

import {
  ClientMessageConditions,
  ClientMessageInitialSubjects,
} from "./conditions"
import type { ConditionErrorMessage } from "./types"

/**
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
