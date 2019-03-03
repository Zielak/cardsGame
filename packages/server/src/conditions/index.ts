import { State } from "../state"
import { ICondition } from "condition"
import { PlayerEvent } from "player"

export * from "./isPlayersTurn"
export * from "./matchesRank"
export * from "./matchesSuit"
export * from "./targetsNameIs"
export * from "./isOwner"
export * from "./isSelected"
export * from "./hasAtLeastXEntitiesSelected"
export * from "./matchesSelectedWith"
export { default as selectedEntities } from "./selectedEntities"

export const OR = (...conditions: ICondition[]): ICondition => {
  return (state: State, event: PlayerEvent) => {
    return conditions.some(cond => cond(state, event))
  }
}

export const AND = (...conditions: ICondition[]): ICondition => {
  return (state: State, event: PlayerEvent) => {
    return conditions.every(cond => cond(state, event))
  }
}

export const NOT = (...conditions: ICondition[]): ICondition => {
  return (state: State, event: PlayerEvent) => {
    return !conditions.every(cond => cond(state, event))
  }
}
