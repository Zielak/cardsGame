import {
  ActionTemplate,
  conditions as con,
  commands as cmd,
  ServerPlayerEvent,
  State,
  Card,
  ClassicCard,
  Deck,
  logs
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
  selectedMatchSuit,
  selectedMatchRank
} from "./conditions"

export const SelectCard: ActionTemplate = {
  name: "SelectCard",
  interaction: {
    type: "classicCard"
  },
  conditions: [
    con.isOwner,
    con.isPlayersTurn,
    con.NOT(con.isSelected),
    con.matchesSelectedWith("rank")
  ],
  commandFactory: (state: State, event: ServerPlayerEvent) => {
    return new cmd.SelectEntity(event.player, event.target, true)
  }
}

export const DeselectCard: ActionTemplate = {
  name: "DeselectCard",
  interaction: {
    type: "classicCard"
  },
  conditions: [con.isOwner, con.isPlayersTurn, con.isSelected],
  commandFactory: (state: MakaoState, event: ServerPlayerEvent) => {
    const selected = event.target as ClassicCard
    const isSelected = event.player.isEntitySelected(selected)

    if (!isSelected) {
      throw new Error(
        `Card "${selected.name}" isn't currently selected by this player`
      )
    }

    return new cmd.SelectEntity(event.player, event.target, false)
  }
}

export const Atack23: ActionTemplate = {
  name: "Atack23",
  interaction: {
    type: "pile"
  },
  conditions: [
    con.isPlayersTurn,
    con.isOwner,
    con.OR(con.matchesSuit, con.matchesRank)
  ],
  commandFactory: (state: State, event: ServerPlayerEvent) => {
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
  interaction: {
    type: "classicCard",
    rank: "K",
    suit: ["H", "S"]
  },
  conditions: [
    con.isPlayersTurn,
    con.isOwner,
    con.OR(con.matchesSuit, con.matchesRank)
  ],
  commandFactory: (state: State, event: ServerPlayerEvent) => {
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
  interaction: {
    type: "deck"
  },
  conditions: [con.isPlayersTurn],
  commandFactory: (state: MakaoState, event: ServerPlayerEvent) => {
    const deck = event.target as Deck
    const target = event.player.findByType("hand")

    logs.log("DrawCards", state.atackPoints)
    return [
      new cmd.DealCards(deck, target, Math.max(1, state.atackPoints)),
      state.atackPoints > 0 ? new SetAtackPoints(0) : new cmd.Noop(),
      new cmd.NextPlayer()
    ]
  }
}

export const SkipTurn: ActionTemplate = {
  name: "SkipTurn",
  interaction: {
    type: "pile",
    name: "mainPile"
  },
  conditions: [
    con.isPlayersTurn,
    con.NOT(isAtWar),
    /**
     * 4 was not yet played
     *   OR
     * 4 was played and you have 4 in hand
     */
    con.AND(con.NOT(playedSkipTurn)),
    // 4 was just played
    con.AND(playedSkipTurn, con.matchesRank)
  ],
  commandFactory: (state: State, event: ServerPlayerEvent) => {
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
  interaction: {
    type: "pile",
    name: "mainPile"
  },
  conditions: [
    con.isPlayersTurn,
    con.NOT(isAtWar),
    con.selectedEntities.matchRank(["5", "6", "7", "8", "9", "10"]),
    con.OR(selectedMatchSuit, selectedMatchRank)
  ],
  commandFactory: (state: State, event: ServerPlayerEvent) => {
    const cards = event.player.selectedEntities as ClassicCard[]
    const source = event.player.findByType("hand")
    const target = state.entities.findByName("mainPile")

    const pileTop = target.top as ClassicCard

    // Sort, so the matching card goes first
    cards.sort((a, b) => {
      if (a.rank === pileTop.rank || a.suit === pileTop.suit) {
        if (b.rank === pileTop.rank || b.suit === pileTop.suit) {
          return 0
        }
        return 1
      }
      return -1
    })

    logs.log("PlayNormalCard")
    return [
      new cmd.ClearSelection(event.player),
      new cmd.ChangeParent(cards, source, target),
      // TODO: let player choose the order of the rest
      new cmd.ShowCard(cards),
      new cmd.NextPlayer()
    ]
  }
}
