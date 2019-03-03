import { ICondition } from "../../condition"
import { MakaoState } from "./state"
import { ClassicCard } from "../../entities"
import { PlayerEvent } from "../../types"
import { logs } from "../../logs"

export const isAtWar: ICondition = (state: MakaoState) => {
  return state.isAtWar
}

export const playedSkipTurn: ICondition = (state: MakaoState) => {
  const pile = state.entities.findByName("mainPile")
  const topCard = pile.top as ClassicCard
  return topCard.rank === "4"
}

const isNonFunctional = (card: ClassicCard) => {
  const matchType = card.type === "classicCard"

  const nonFunCard = ["5", "6", "7", "8", "9", "10", "Q"].some(
    rank => rank === card.rank
  )

  const nonFunKing =
    card.rank === "K" && ["C", "D"].some(suit => suit === card.suit)

  return matchType && (nonFunCard || nonFunKing)
}

export const selectedAreNonFunctional: ICondition = (_, event: PlayerEvent) => {
  const selected = event.player.selectedEntities as ClassicCard[]
  return selected.every(isNonFunctional)
}

export const selectedMatchRank: ICondition = (
  state: MakaoState,
  event: PlayerEvent
) => {
  const pileTop = state.entities.findByName("mainPile").top as ClassicCard
  const selectedRank = (event.player.selectedEntities[0] as ClassicCard).rank
  if (selectedRank === pileTop.rank) {
    return true
  } else {
    logs.warn(
      "selectedMatchRank",
      `pile.top "${pileTop.rank}" !== cards rank "${selectedRank}"`
    )
    return false
  }
}

export const selectedMatchSuit: ICondition = (
  state: MakaoState,
  event: PlayerEvent
) => {
  const pileTop = state.entities.findByName("mainPile").top as ClassicCard
  const selectedSuit = (event.player.selectedEntities[0] as ClassicCard).suit
  if (selectedSuit === pileTop.suit) {
    return true
  } else {
    logs.warn(
      "selectedMatchSuit",
      `pile.top "${pileTop.suit}" !== cards rank "${selectedSuit}"`
    )
    return false
  }
}
