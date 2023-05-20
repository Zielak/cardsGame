import { chalk, logs } from "@cardsgame/utils"

import type { BaseActionDefinition } from "../actions/base.js"
import { ClientMessageContext } from "../actions/types.js"
import { getCustomError } from "../conditions/errors.js"
import type { State } from "../state/state.js"

import type { ClientMessageConditions } from "./conditions.js"
import type { ConditionErrorMessage } from "./types.js"

/**
 * Used only internally and in `server-testing` package.
 *
 * @ignore
 */
export function runConditionOnAction<
  A extends BaseActionDefinition<S>,
  S extends State
>(
  conditionsChecker: ClientMessageConditions<S>,
  messageContext: ClientMessageContext<S>,
  action: A
): ConditionErrorMessage {
  logs.group(`action: ${chalk.white(action.name)}`)
  let errorMessage: ConditionErrorMessage

  try {
    action.checkConditions(conditionsChecker, messageContext)
  } catch (e) {
    const customMessage = getCustomError(conditionsChecker.getCore())

    const debugErrorMessage = (e as Error).message
    logs.debug("\t", debugErrorMessage)
    errorMessage = {
      internal: !customMessage,
      message: customMessage ?? debugErrorMessage,
    }
  }
  logs.groupEnd(
    `result: ${errorMessage ? chalk.green("true") : chalk.yellow("false")}`
  )

  return errorMessage
}
