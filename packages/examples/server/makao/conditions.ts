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

export const chosenAreNonFunctional: ICondition = (
  _,
  event: ServerPlayerEvent
) => {
  const chosen = event.player.findByName("chosenCards")
    .childrenArray as ClassicCard[]
  return chosen.every(isNonFunctional)
}

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
