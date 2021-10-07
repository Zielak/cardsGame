import { Conditions, ConditionsMethods } from "../conditions"
import { State } from "../state"

export class BotConditions<S extends State> extends Conditions<
  S,
  BotConditions<S>
> {}

export interface BotConditions<S extends State> {
  /**
   * Changes current `subject` to interacting `Player`
   */
  player: ConditionsMethods<S, BotConditions<S>> //Player;
}

export class EntityConditions<S extends State> extends Conditions<
  S,
  EntityConditions<S>
> {}

export interface EntityConditions<S extends State> {
  /**
   * Changes current `subject` to interacting `Player`
   */
  entity: ConditionsMethods<S, EntityConditions<S>> //Player;
}
