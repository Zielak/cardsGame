import { getFlag } from "./utils.js"

export type CustomConditionError = string

/**
 * Use to fail an assertion other part of Condition for any reason (like validation).
 * Use custom error message if available
 * @category Conditions
 */
export function throwError(target: Record<string, any>, message: string): void {
  const customMessage = getCustomError(target)

  throw new Error(customMessage ?? message)
}

export function getCustomError(
  target: Record<string, any>
): CustomConditionError {
  return getFlag(target, "customError")
}
