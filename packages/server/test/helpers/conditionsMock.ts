import { Conditions, State } from "../../src"
import type { ConditionsMethods } from "../../src/conditions"

export class ConditionsMock<S extends State> extends Conditions<
  S,
  ConditionsMock<S>
> {}

export interface ConditionsMock<S extends State> {
  example: ConditionsMethods<S, ConditionsMock<S>>
}
