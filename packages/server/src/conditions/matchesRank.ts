import { State } from "../state"
import { ICondition } from "condition"
import { PlayerEvent } from "player"
import { logs } from "../logs"
import { ClassicCard } from "../entities"

export const matchesRank: ICondition = (
  state: State,
  event: PlayerEvent
): boolean => {
  const pileTop = state.entities.findByName("mainPile").top as ClassicCard
  const chosenCard = event.target as ClassicCard
  if (chosenCard.rank === pileTop.rank) {
    return true
  }
  logs.warn(
    "matchesRank",
    `pile.top "${pileTop.rank}" !== cards rank "${chosenCard.rank}"`
  )
  return false
}
