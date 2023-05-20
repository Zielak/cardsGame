import { Conditions } from "../conditions/conditions.js"
import type { Bot } from "../player/bot.js"
import type { State } from "../state/state.js"
import type { ChildTrait } from "../traits/child.js"

export type BotConditionsInitialSubjects = { player: Bot }
export type BotContext<S extends State> = {
  state: S
  variant: S["variantData"]
} & BotConditionsInitialSubjects
export class BotConditions<S extends State> extends Conditions<
  S,
  BotConditionsInitialSubjects
> {}

export const prepareBotConditionsContext = <S extends State>(
  state: S,
  initialSubjects?: BotConditionsInitialSubjects
): BotContext<S> => {
  return {
    state,
    variant: state.variantData,
    ...initialSubjects,
  }
}

// -===-

type EntityConditionsInitialSubjects = { entity: ChildTrait }
export type EntityConditionsContext<S extends State> = {
  state: S
  variant: S["variantData"]
  defaultSubjectKey: "entity"
} & EntityConditionsInitialSubjects
export class EntityConditions<S extends State> extends Conditions<
  S,
  EntityConditionsInitialSubjects
> {}

export const prepareEntityConditionsContext = <S extends State>(
  state: S,
  initialSubjects?: EntityConditionsInitialSubjects
): EntityConditionsContext<S> => {
  return {
    state,
    variant: state.variantData,
    defaultSubjectKey: "entity",
    ...initialSubjects,
  }
}
