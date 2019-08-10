import { ServerPlayerEvent } from "../../player"
import { propsMatch } from "./helpers"
import { logs } from "@cardsgame/utils"
import { ICondition } from ".."
import { IParent, getChildren } from "../../traits/parent"

export const childrenOf = (entity: IParent) => {
  return {
    matchRank: (_ranks: string | string[]) => {
      const ranks = Array.isArray(_ranks) ? _ranks : [_ranks]

      const childrenOfMatchRank: ICondition = (_, event: ServerPlayerEvent) => {
        const result = getChildren(entity).every(propsMatch("rank", ranks))
        // logs.verbose(`│\t\tmatchRank:`, result)
        return result
      }
      return childrenOfMatchRank
    },
    matchSuit: (_suits: string | string[]) => {
      const suits = Array.isArray(_suits) ? _suits : [_suits]

      const childrenOfMatchSuit = (_, event: ServerPlayerEvent) => {
        const result = getChildren(entity).every(propsMatch("suit", suits))
        // logs.verbose(`│\t\tmatchSuit:`, result)
        return result
      }
      return childrenOfMatchSuit
    }
  }
}
