import { ServerPlayerEvent } from "../../player"
import { propsMatch } from "./helpers"
import { logs } from "../../logs"
import { ICondition } from ".."
import { IParent, getChildren } from "../../entities/traits/parent"

export const childrenOf = (entity: IParent) => {
  return {
    matchRank: (_ranks: string | string[]) => {
      const ranks = Array.isArray(_ranks) ? _ranks : [_ranks]

      const cond: ICondition = (_, event: ServerPlayerEvent) => {
        const result = getChildren(entity).every(propsMatch("rank", ranks))
        logs.verbose(`│\t\tmatchRank:`, result)
        return result
      }
      cond._name = `childrenOf.matchRank`
      return cond
    },
    matchSuit: (_suits: string | string[]) => {
      const suits = Array.isArray(_suits) ? _suits : [_suits]

      const cond = (_, event: ServerPlayerEvent) => {
        const result = getChildren(entity).every(propsMatch("suit", suits))
        logs.verbose(`│\t\tmatchSuit:`, result)
        return result
      }
      cond._name = `childrenOf.matchSuit`
      return cond
    }
  }
}