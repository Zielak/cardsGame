import { ServerPlayerEvent } from "../../player"
import { propsMatch } from "./helpers"
import { Entity } from "../../entity"

export default (entity: Entity) => {
  const children = entity.childrenArray

  return {
    matchRank: (_ranks: string | string[]) => {
      const ranks = Array.isArray(_ranks) ? _ranks : [_ranks]

      return (_, event: ServerPlayerEvent) => {
        return children.every(propsMatch("rank", ranks))
      }
    },
    matchSuit: (_suits: string | string[]) => {
      const suits = Array.isArray(_suits) ? _suits : [_suits]

      return (_, event: ServerPlayerEvent) => {
        return children.every(propsMatch("suit", suits))
      }
    }
  }
}
