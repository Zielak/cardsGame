import { ICondition } from "."
import { State } from "../state"
import { ServerPlayerEvent } from "../player"

/**
 * Checks value of property on target entity.
 * @param property
 * @param expectedValue
 */
export const propEquals = (property: string, expectedValue: any) => {
  const propEquals: ICondition = (state: State, event: ServerPlayerEvent) =>
    event.entity[property] === expectedValue

  // cond.name = `"${property}" === "${expectedValue}"`
  return propEquals
}
