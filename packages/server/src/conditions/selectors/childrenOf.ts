import { ServerPlayerEvent } from "../../player"
import { propsMatch } from "./helpers"
import { Entity } from "../../entity"
import { logs } from "../../logs"

export default (entity: Entity) => {
  const children = entity.childrenArray

  return {
    matchRank: (_ranks: string | string[]) => {
      const ranks = Array.isArray(_ranks) ? _ranks : [_ranks]

      const cond = (_, event: ServerPlayerEvent) => {
        const result = children.every(propsMatch("rank", ranks))
        logs.verbose(`│\t\tmatchRank:`, result)
        return result
      }
      // cond._name = `childrenOf(${entity.type}:${entity.name}).matchRank`
      cond._name = `childrenOf.matchRank`
      return cond
    },
    matchSuit: (_suits: string | string[]) => {
      const suits = Array.isArray(_suits) ? _suits : [_suits]

      const cond = (_, event: ServerPlayerEvent) => {
        const result = children.every(propsMatch("suit", suits))
        logs.verbose(`│\t\tmatchSuit:`, result)
        return result
      }
      // cond._name = `childrenOf(${entity.type}:${entity.name}).matchSuit`
      cond._name = `childrenOf.matchSuit`
      return cond
    }
  }
}
