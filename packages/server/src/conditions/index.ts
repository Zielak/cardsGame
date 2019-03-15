import { State } from "../state"
import { ICondition } from "../condition"
import { ServerPlayerEvent } from "../player"
import { logs } from "../logs"

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
export * from "./hasChildren"
export { default as selectedEntities } from "./selectors/selectedEntities"
export { default as childrenOf } from "./selectors/childrenOf"

export const OR = (...conditions: ICondition[]): ICondition => {
  const OR = (state: State, event: ServerPlayerEvent) => {
    const result = conditions.some(cond => cond(state, event))
    logs.verbose(`│\t\tOR:`, result)
    return result
  }
  OR._name = `OR( ${conditions.map(c => c._name).join(", ")} )`
  return OR
}

export const AND = (...conditions: ICondition[]): ICondition => {
  const AND = (state: State, event: ServerPlayerEvent) => {
    const result = conditions.every(cond => cond(state, event))
    logs.verbose(`│\t\tAND:`, result)
    return result
  }
  AND._name = `AND( ${conditions.map(c => c._name).join(", ")} )`
  return AND
}

export const NOT = (...conditions: ICondition[]): ICondition => {
  const NOT = (state: State, event: ServerPlayerEvent) => {
    const result = !conditions.every(cond => cond(state, event))
    logs.verbose(`│\t\tNOT:`, result)
    return result
  }
  NOT._name = `NOT( ${conditions.map(c => c._name).join(", ")} )`
  return NOT
}
