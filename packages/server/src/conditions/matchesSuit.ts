import { State } from "../state"
import { ICondition } from "../condition"
import { ServerPlayerEvent } from "../player"
import { logs } from "../logs"
import { ClassicCard } from "../entities"

export const matchesSuit: ICondition = (
  state: State,
  event: ServerPlayerEvent
): boolean => {
  const pileTop = state.entities.findByName("mainPile").top as ClassicCard
  const chosenCard = event.target as ClassicCard
  if (chosenCard.suit === pileTop.suit) {
    return true
  } else {
    logs.warn(
      "matchesSuit",
      `pile.top "${pileTop.suit}" !== cards suit "${chosenCard.suit}"`
    )
    return false
  }
}
