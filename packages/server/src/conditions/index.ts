import { State } from "../state"
import { ICondition } from "../condition"
import { ServerPlayerEvent } from "../player"

export * from "./isPlayersTurn"
export * from "./matchesRankWithPile"
export * from "./matchesSuitWithPile"
export * from "./targetsNameIs"
export * from "./isOwner"
export * from "./isSelected"
export * from "./hasAtLeastXEntitiesSelected"
export * from "./matchesSelectedWith"
export * from "./matchesPropWith"
export * from "./parentIs"
export { default as selectedEntities } from "./selectors/selectedEntities"
export { default as childrenOf } from "./selectors/childrenOf"

export const OR = (...conditions: ICondition[]): ICondition => {
  return (state: State, event: ServerPlayerEvent) => {
    return conditions.some(cond => cond(state, event))
  }
}

export const AND = (...conditions: ICondition[]): ICondition => {
  return (state: State, event: ServerPlayerEvent) => {
    return conditions.every(cond => cond(state, event))
  }
}

export const NOT = (...conditions: ICondition[]): ICondition => {
  return (state: State, event: ServerPlayerEvent) => {
    return !conditions.every(cond => cond(state, event))
  }
}
