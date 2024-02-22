import chalk from "chalk"

import type { BaseActionDefinition } from "../actions/base.js"
import {
  ClientMessageConditions,
  ClientMessageContext,
} from "../conditions/context/clientMessage.js"
import { getCustomError } from "../conditions/errors.js"
import { logs } from "../logs.js"
import type { State } from "../state/state.js"

import type { ConditionErrorMessage } from "./types.js"

/**
 * Used only internally and in `server-testing` package.
 *
 * @ignore
 */
export function runConditionOnAction<
  A extends BaseActionDefinition<S>,
  S extends State,
>(
  conditionsChecker: ClientMessageConditions<S>,
  messageContext: ClientMessageContext<S>,
  action: A,
): ConditionErrorMessage {
  logs.group(`action: ${chalk.white(action.name)}`)
  let errorMessage: ConditionErrorMessage

  try {
    action.checkConditions(conditionsChecker, messageContext)
  } catch (e) {
    const customMessage = getCustomError(conditionsChecker.getCore())

    const debugErrorMessage = (e as Error).message
    errorMessage = {
      internal: !customMessage,
      message: customMessage ?? debugErrorMessage,
    }
  }
  logs.groupEnd(
    `result: ${errorMessage ? chalk.yellow("false") : chalk.green("true")}`,
  )

  return errorMessage
}
