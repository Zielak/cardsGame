import { MakaoState } from "./state"
import {
  ClassicCard,
  ICondition,
  logs,
  ServerPlayerEvent
} from "@cardsgame/server"

export const isAtWar: ICondition = (state: MakaoState) => {
  return state.isAtWar
}
isAtWar._name = "isAtWar"

/**
 * Is there 4 on the top of Pile
 */
export const skipTurnPlayed: ICondition = (state: MakaoState) => {
  const pile = state.entities.findByName("mainPile")
  const topCard = pile.top as ClassicCard
  const result = topCard.rank === "4"
  logs.verbose(`│\t\tskipTurnPlayed:`, result)
  return result
}
skipTurnPlayed._name = "skipTurnPlayed"

/**
 * Given card has no special function
 */
const isNonFunctional = (card: ClassicCard) => {
  const matchType = card.type === "classicCard"

  const nonFunCard = ["5", "6", "7", "8", "9", "10", "Q"].some(
    rank => rank === card.rank
  )

  const nonFunKing =
    card.rank === "K" && ["C", "D"].some(suit => suit === card.suit)

  return matchType && (nonFunCard || nonFunKing)
}

export const chosenAreNonFunctional: ICondition = (
  _,
  event: ServerPlayerEvent
) => {
  const chosen = event.player.findByName("chosenCards")
    .childrenArray as ClassicCard[]
  return chosen.every(isNonFunctional)
}
chosenAreNonFunctional._name = "chosenAreNonFunctional"

export const chosenMatchRank: ICondition = (
  state: MakaoState,
  event: ServerPlayerEvent
) => {
  const pileTop = state.entities.findByName("mainPile").top as ClassicCard
  const chosenRank = (event.player.findByName("chosenCards")
    .childrenArray[0] as ClassicCard).rank
  if (chosenRank === pileTop.rank) {
    return true
  } else {
    logs.warn(
      "chosenMatchRank",
      `pile.top "${pileTop.rank}" !== cards rank "${chosenRank}"`
    )
    return false
  }
}
chosenMatchRank._name = "chosenMatchRank"

export const chosenMatchSuit: ICondition = (
  state: MakaoState,
  event: ServerPlayerEvent
) => {
  const pileTop = state.entities.findByName("mainPile").top as ClassicCard
  const chosenSuit = (event.player.findByName("chosenCards")
    .childrenArray[0] as ClassicCard).suit
  if (chosenSuit === pileTop.suit) {
    return true
  } else {
    logs.warn(
      "chosenMatchSuit",
      `pile.top "${pileTop.suit}" !== cards rank "${chosenSuit}"`
    )
    return false
  }
}
chosenMatchSuit._name = "chosenMatchSuit"

export const matchesRankWithPile: ICondition = (
  state: MakaoState,
  event: ServerPlayerEvent
): boolean => {
  const pileTop = state.entities.find(e => e.name === "mainPile")
    .top as ClassicCard
  const chosenCard = event.entity as ClassicCard
  if (chosenCard.rank === pileTop.rank) {
    return true
  }
  logs.warn(
    "matchesRankWithPile",
    `pile.top "${pileTop.rank}" !== cards rank "${chosenCard.rank}"`
  )
  return false
}
matchesRankWithPile._name = "matchesRankWithPile"

export const matchesSuitWithPile: ICondition = (
  state: MakaoState,
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
