import {
  conditions as con,
  commands as cmd,
  ServerPlayerEvent,
  State,
  Card,
  ClassicCard,
  Deck,
  logs,
  ActionTemplate
} from "@cardsgame/server"

import { MakaoState } from "./state"
import {
  IncreaseAtackPoints,
  SetAtackPoints,
  IncreaseSkipPoints
} from "./commands"
import {
  isAtWar,
  playedSkipTurn,
  chosenMatchSuit,
  chosenMatchRank
} from "./conditions"

export const SelectCard: ActionTemplate = {
  name: "SelectCard",
  getInteractions: () => [
    {
      type: "classicCard"
    }
  ],
  getConditions: (_, event: ServerPlayerEvent) => {
    const conds = [
      con.isOwner,
      con.isPlayersTurn,
      con.parentIs({ name: "playersHand" })
    ]
    if (event.player.findByName("chosenCards").length === 0) {
      conds.push(con.OR(con.matchesRankWithPile, con.matchesSuitWithPile))
    } else {
      conds.push(
        con.matchesPropWith(
          "rank",
          (_, event) => event.player.findByName("chosenCards").childrenArray
        )
      )
    }
    return conds
  },
  getCommands: (state: State, event: ServerPlayerEvent) => {
    const playersHand = event.player.findByName("playersHand")
    const chosenCardsRow = event.player.findByName("chosenCards")

    return new cmd.ChangeParent(event.target, playersHand, chosenCardsRow)
  }
}

export const DeselectCard: ActionTemplate = {
  name: "DeselectCard",
  getInteractions: () => [
    {
      type: "classicCard"
    }
  ],
  getConditions: () => [
    con.isOwner,
    con.isPlayersTurn,
    con.parentIs({ name: "chosenCards" })
  ],
  getCommands: (state: MakaoState, event: ServerPlayerEvent) => {
    const playersHand = event.player.findByName("playersHand")
    const chosenCardsRow = event.player.findByName("chosenCards")

    return new cmd.ChangeParent(event.target, chosenCardsRow, playersHand)
  }
}

export const Atack23: ActionTemplate = {
  name: "Atack23",
  getInteractions: () => [
    {
      type: "pile"
    }
  ],
  getConditions: () => [
    con.isPlayersTurn,
    con.isOwner,
    con.OR(con.matchesSuitWithPile, con.matchesRankWithPile)
  ],
  getCommands: (state: State, event: ServerPlayerEvent) => {
    const card = event.target as ClassicCard
    const source = event.target.parentEntity
    const target = state.entities.findByName("mainPile")

    logs.log("Atack23")
    return [
      new cmd.ChangeParent(event.target, source, target),
      new cmd.ShowCard(event.target as Card),
      new IncreaseAtackPoints(parseInt(card.rank)),
      new cmd.NextPlayer()
    ]
  }
}

export const AtackKing: ActionTemplate = {
  name: "AtackKing",
  getInteractions: () => [
    {
      type: "classicCard",
      rank: "K",
      suit: ["H", "S"]
    }
  ],
  getConditions: () => [
    con.isPlayersTurn,
    con.isOwner,
    con.OR(con.matchesSuitWithPile, con.matchesRankWithPile)
  ],
  getCommands: (state: State, event: ServerPlayerEvent) => {
    const card = event.target as ClassicCard
    const source = event.target.parentEntity
    const target = state.entities.findByName("mainPile")

    logs.log("AtackKing")
    return [
      new cmd.ChangeParent(event.target, source, target),
      new cmd.ShowCard(event.target as Card),
      new IncreaseAtackPoints(5),
      // Variant here
      card.suit === "H" ? new cmd.NextPlayer() : new cmd.PreviousPlayer()
    ]
  }
}

export const DrawCards: ActionTemplate = {
  name: "DrawCards",
  getInteractions: () => [
    {
      type: "deck"
    }
  ],
  getConditions: () => [con.isPlayersTurn],
  getCommands: (state: MakaoState, event: ServerPlayerEvent) => {
    const deck = event.target as Deck
    const target = event.player.findByName("playersHand")

    logs.log("DrawCards", state.atackPoints)
    return [
      new cmd.DealCards(deck, target, Math.max(1, state.atackPoints)),
      state.atackPoints > 0 ? new SetAtackPoints(0) : new cmd.Noop(),
      new cmd.NextPlayer()
    ]
  }
}

export const PlaySkipTurn: ActionTemplate = {
  name: "PlaySkipTurn",
  getInteractions: () => [
    {
      type: "pile",
      name: "mainPile"
    }
  ],
  getConditions: () => [
    con.isPlayersTurn,
    con.NOT(isAtWar),
    /**
     * 4 was not yet played
     *   OR
     * 4 was played and you have 4 in hand
     */
    con.AND(con.NOT(playedSkipTurn)),
    // 4 was just played
    con.AND(playedSkipTurn, con.matchesRankWithPile)
  ],
  getCommands: (state: State, event: ServerPlayerEvent) => {
    const source = event.target.parentEntity
    const target = state.entities.findByName("mainPile")
    logs.log("SkipTurn")
    return [
      new cmd.ChangeParent(event.target, source, target),
      new cmd.ShowCard(event.target as Card),
      new IncreaseSkipPoints(1),
      new cmd.NextPlayer()
    ]
  }
}

export const PlayNormalCards: ActionTemplate = {
  name: "PlayNormalCards",
  getInteractions: () => [
    {
      type: "pile",
      name: "mainPile"
    }
  ],
  getConditions: (_, event: ServerPlayerEvent) => [
    con.isPlayersTurn,
    con.NOT(isAtWar),
    con
      .childrenOf(event.player.findByName("chosenCards"))
      .matchRank(["5", "6", "7", "8", "9", "10"]),
    con.OR(chosenMatchSuit, chosenMatchRank)
  ],
  getCommands: (state: State, event: ServerPlayerEvent) => {
    const cards = event.player.findByName("chosenCards")
      .childrenArray as ClassicCard[]
    const orderingRow = event.player.findByName("chosenCards")
    const pile = state.entities.findByName("mainPile")

    logs.log("PlayNormalCard")
    return [
      new cmd.ClearSelection(event.player),
      new cmd.ChangeParent(cards, orderingRow, pile),
      new cmd.ShowCard(cards),
      new cmd.NextPlayer()
    ]
  }
}
