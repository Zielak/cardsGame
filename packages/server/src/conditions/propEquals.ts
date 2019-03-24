import { ICondition } from "../condition"
import { State } from "../state"
import { ServerPlayerEvent } from "../player"

export const propEquals = (property: string, expectedValue: any) => {
  const cond: ICondition = (state: State, event: ServerPlayerEvent) =>
    event.entity[property] === expectedValue

  cond._name = `"${property}" === "${expectedValue}"`
  return cond
}
