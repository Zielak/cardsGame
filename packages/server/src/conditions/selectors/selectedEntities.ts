import { ServerPlayerEvent } from "../../player"
import { propsMatch } from "./helpers"

export const matchRank = (_ranks: string | string[]) => {
  const ranks = Array.isArray(_ranks) ? _ranks : [_ranks]

  return (_, event: ServerPlayerEvent) => {
    const selected = event.player.selectedEntities
    return selected.every(propsMatch("rank", ranks))
  }
}

export default {
  matchRank
}
