import { State } from "../state"
import { ICondition } from "../condition"
import { ServerPlayerEvent } from "../player"
import { logs } from "../logs"
import { ClassicCard } from "../entities"

export const matchesSuitWithPile: ICondition = (
  state: State,
  event: ServerPlayerEvent
): boolean => {
  const pileTop = state.entities.find(e => e.name === "mainPile")
    .top as ClassicCard
  const chosenCard = event.entity as ClassicCard
  if (chosenCard.suit === pileTop.suit) {
    return true
  } else {
    logs.warn(
      "matchesSuitWithPile",
      `pile.top "${pileTop.suit}" !== cards suit "${chosenCard.suit}"`
    )
    return false
  }
}
matchesSuitWithPile._name = "matchesSuitWithPile"
