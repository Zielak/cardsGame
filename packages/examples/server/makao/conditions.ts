import { MakaoState } from "./state"
import {
  ClassicCard,
  conditions,
  logs,
  ServerPlayerEvent,
  getTop,
  getBottom,
  Hand,
  getChildren,
  find
} from "@cardsgame/server"

export const isAtWar: conditions.ICondition = (state: MakaoState) => {
  return state.isAtWar
}
isAtWar._name = "isAtWar"

/**
 * Is there 4 on the top of Pile
 */
export const skipTurnPlayed: conditions.ICondition = (state: MakaoState) => {
  const pile = find<Hand>(state, { name: "mainPile" })
  const topCard = getTop<ClassicCard>(pile)
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

export const chosenAreNonFunctional: conditions.ICondition = (
  state: MakaoState,
  { player }: ServerPlayerEvent
) => {
  const cards = find(state, { owner: player, name: "chosenCards" })
  const chosen = getChildren(cards)
  return chosen.every(isNonFunctional)
}
chosenAreNonFunctional._name = "chosenAreNonFunctional"

export const chosenMatchRank: conditions.ICondition = (
  state: MakaoState,
  { player }: ServerPlayerEvent
) => {
  const pileTop = getTop<ClassicCard>(find(state, { name: "mainPile" }))

  const { rank: chosenRank } = getBottom<ClassicCard>(
    find(state, { owner: player, name: "chosenCards" })
  )
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

export const chosenMatchSuit: conditions.ICondition = (
  state: MakaoState,
  { player }: ServerPlayerEvent
) => {
  const pileTop = getTop<ClassicCard>(find(state, { name: "mainPile" }))
  const { suit: chosenSuit } = getBottom<ClassicCard>(
    find(state, { owner: player, name: "chosenCards" })
  )
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

export const matchesRankWithPile: conditions.ICondition = (
  state: MakaoState,
  { entity }: ServerPlayerEvent
): boolean => {
  const pileTop = getTop<ClassicCard>(find(state, { name: "mainPile" }))
  const chosenCard = entity as ClassicCard
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

export const matchesSuitWithPile: conditions.ICondition = (
  state: MakaoState,
  { entity }: ServerPlayerEvent
): boolean => {
  const pileTop = getTop<ClassicCard>(find(state, { name: "mainPile" }))
  const chosenCard = entity as ClassicCard
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
