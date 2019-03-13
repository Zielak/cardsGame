import { State } from "../state"
import { ICondition } from "../condition"
import { ServerPlayerEvent } from "../player"
import { logs } from "../logs"
import { ClassicCard } from "../entities"

export const matchesRankWithPile: ICondition = (
  state: State,
  event: ServerPlayerEvent
): boolean => {
  const pileTop = state.entities.findByName("mainPile").top as ClassicCard
  const chosenCard = event.target as ClassicCard
  if (chosenCard.rank === pileTop.rank) {
    return true
  }
  logs.warn(
    "matchesRankWithPile",
    `pile.top "${pileTop.rank}" !== cards rank "${chosenCard.rank}"`
  )
  return false
}
