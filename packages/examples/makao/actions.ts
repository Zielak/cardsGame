import {
  ActionTemplate,
  conditions as C,
  PlayerEvent,
  State,
  Card,
  ClassicCard,
  Deck,
  logs
} from "../.."
import {
  ChangeParent,
  ShowCard,
  NextPlayer,
  PreviousPlayer,
  DealCards,
  Noop,
  SelectEntity
} from "../../commands"

import {
  IncreaseAtackPoints,
  SetAtackPoints,
  IncreaseSkipPoints
} from "./commands"
import { MakaoState } from "./state"
import {
  isAtWar,
  playedSkipTurn,
  selectedMatchSuit,
  selectedMatchRank
} from "./conditions"
import { ClearSelection } from "../../commands/clearSelection"

export const SelectCard: ActionTemplate = {
  name: "SelectCard",
  interaction: {
    type: "classicCard"
  },
  conditions: [
    C.isOwner,
    C.isPlayersTurn,
    C.NOT(C.isSelected),
    C.matchesSelectedWith("rank")
  ],
  commandFactory: (state: State, event: PlayerEvent) => {
    return new SelectEntity(event.player, event.target, true)
  }
}

export const DeselectCard: ActionTemplate = {
  name: "DeselectCard",
  interaction: {
    type: "classicCard"
  },
  conditions: [C.isOwner, C.isPlayersTurn, C.isSelected],
  commandFactory: (state: MakaoState, event: PlayerEvent) => {
    const selected = event.target as ClassicCard
    const isSelected = event.player.isEntitySelected(selected)

    if (!isSelected) {
      throw new Error(
        `Card "${selected.name}" isn't currently selected by this player`
      )
    }

    return new SelectEntity(event.player, event.target, false)
  }
}

export const Atack23: ActionTemplate = {
  name: "Atack23",
  interaction: {
    type: "pile"
  },
  conditions: [C.isPlayersTurn, C.isOwner, C.OR(C.matchesSuit, C.matchesRank)],
  commandFactory: (state: State, event: PlayerEvent) => {
    const card = event.target as ClassicCard
    const source = event.target.parentEntity
    const target = state.entities.findByName("mainPile")

    logs.log("Atack23")
    return [
      new ChangeParent(event.target, source, target),
      new ShowCard(event.target as Card),
      new IncreaseAtackPoints(parseInt(card.rank)),
      new NextPlayer()
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
  conditions: [C.isPlayersTurn, C.isOwner, C.OR(C.matchesSuit, C.matchesRank)],
  commandFactory: (state: State, event: PlayerEvent) => {
    const card = event.target as ClassicCard
    const source = event.target.parentEntity
    const target = state.entities.findByName("mainPile")

    logs.log("AtackKing")
    return [
      new ChangeParent(event.target, source, target),
      new ShowCard(event.target as Card),
      new IncreaseAtackPoints(5),
      // Variant here
      card.suit === "H" ? new NextPlayer() : new PreviousPlayer()
    ]
  }
}

export const DrawCards: ActionTemplate = {
  name: "DrawCards",
  interaction: {
    type: "deck"
  },
  conditions: [C.isPlayersTurn],
  commandFactory: (state: MakaoState, event: PlayerEvent) => {
    const deck = event.target as Deck
    const target = event.player.findByType("hand")

    logs.log("DrawCards", state.atackPoints)
    return [
      new DealCards(deck, target, Math.max(1, state.atackPoints)),
      state.atackPoints > 0 ? new SetAtackPoints(0) : new Noop(),
      new NextPlayer()
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
    C.isPlayersTurn,
    C.NOT(isAtWar),
    /**
     * 4 was not yet played
     *   OR
     * 4 was played and you have 4 in hand
     */
    C.AND(C.NOT(playedSkipTurn)),
    // 4 was just played
    C.AND(playedSkipTurn, C.matchesRank)
  ],
  commandFactory: (state: State, event: PlayerEvent) => {
    const source = event.target.parentEntity
    const target = state.entities.findByName("mainPile")
    logs.log("SkipTurn")
    return [
      new ChangeParent(event.target, source, target),
      new ShowCard(event.target as Card),
      new IncreaseSkipPoints(1),
      new NextPlayer()
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
    C.isPlayersTurn,
    C.NOT(isAtWar),
    C.selectedEntities.matchRank(["5", "6", "7", "8", "9", "10"]),
    C.OR(selectedMatchSuit, selectedMatchRank)
  ],
  commandFactory: (state: State, event: PlayerEvent) => {
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
      new ClearSelection(event.player),
      new ChangeParent(cards, source, target),
      // TODO: let player choose the order of the rest
      new ShowCard(cards),
      new NextPlayer()
    ]
  }
}
