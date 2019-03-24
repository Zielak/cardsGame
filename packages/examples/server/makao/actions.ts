import {
  conditions as con,
  commands as cmd,
  ServerPlayerEvent,
  State,
  ClassicCard,
  Deck,
  logs,
  ActionTemplate
} from "@cardsgame/server"

import { MakaoState } from "./state"
import {
  IncreaseAtackPoints,
  SetAtackPoints,
  IncreaseSkipPoints,
  SetRequestedSuit,
  RevealUI,
  HideUI
} from "./commands"
import { isAtWar } from "./conditions"

export const SelectCard: ActionTemplate = {
  name: "SelectCard",
  description: `Selecting cards makes sure that cards match with the pile.
  No need to keep checking for it in other actions`,
  getInteractions: (state: MakaoState) => {
    if (state.atackPoints > 0) {
      return [
        { type: "classicCard", rank: ["2", "3"] },
        { type: "classicCard", rank: "K", suit: ["H", "S"] }
      ]
    } else if (state.skipPoints > 0) {
      return [{ type: "classicCard", rank: "4" }]
    } else if (state.requestedRank) {
      return [{ type: "classicCard", rank: state.requestedRank }]
    } else if (state.requestedSuit) {
      return [{ type: "classicCard", suit: state.requestedSuit }]
    }
    return [{ type: "classicCard" }]
  },
  getConditions: (state: MakaoState, event: ServerPlayerEvent) => {
    const conditions = [
      con.isOwner,
      con.isPlayersTurn,
      con.parentIs({ name: "playersHand" })
    ]
    // Keep checking pile and state for any current functional cards in effect
    const pile = state.entities.findByName("mainPile")
    const pickedCard = event.target as ClassicCard
    // 4? you shant play any other cards
    if (state.skipPoints > 0) {
      conditions.push(con.matchesRankWithPile)
    }
    // 2,3,K? you shall only play atack cards
    // if (state.atackPoints > 0) {
    //   conditions.push(con.)
    // }
    // A? you should only play requested suit OR other Ace
    // J? you should only play what was requested or another J

    if (event.player.findByName("chosenCards").length === 0) {
      conditions.push(
        con.OR(
          `First card should match anything on Pile`,
          con.matchesRankWithPile,
          con.matchesSuitWithPile
        )
      )
    } else {
      // The rest should match anything already selected
      conditions.push(
        con.matchesPropWith(
          "rank",
          (_, event) => event.player.findByName("chosenCards").childrenArray
        )
      )
    }
    return conditions
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

    if (event.target.idx > 0) {
      return new cmd.ChangeParent(event.target, chosenCardsRow, playersHand)
    } else {
      const allChosenCards = event.player.findByName("chosenCards")
        .childrenArray as ClassicCard[]
      return new cmd.ChangeParent(allChosenCards, chosenCardsRow, playersHand)
    }
  }
}

export const Atack23: ActionTemplate = {
  name: "Atack23",
  getInteractions: () => [
    {
      type: "pile",
      name: "mainPile"
    }
  ],
  getConditions: (_, event: ServerPlayerEvent) => {
    const choosenCards = event.player.findByName("chosenCards")
    return [
      con.hasChildren(choosenCards),
      con.childrenOf(choosenCards).matchRank(["2", "3"]),
      con.isPlayersTurn
    ]
  },
  getCommands: (state: State, event: ServerPlayerEvent) => {
    const cards = event.player.findByName("chosenCards")
      .childrenArray as ClassicCard[]
    const source = event.player.findByName("chosenCards")
    const target = state.entities.findByName("mainPile")

    return [
      new cmd.ChangeParent(cards, source, target),
      new cmd.ShowCard(cards),
      new IncreaseAtackPoints(parseInt(cards[0].rank) * cards.length),
      new cmd.NextPlayer()
    ]
  }
}

export const AtackKing: ActionTemplate = {
  name: "AtackKing",
  getInteractions: () => [
    {
      type: "pile",
      name: "mainPile"
    }
  ],
  getConditions: (_, event: ServerPlayerEvent) => {
    const choosenCards = event.player.findByName("chosenCards")
    return [
      con.hasChildren(choosenCards),
      con.childrenOf(choosenCards).matchRank("K"),
      con.childrenOf(choosenCards).matchSuit(["S", "H"]),
      con.isPlayersTurn
    ]
  },
  getCommands: (state: State, event: ServerPlayerEvent) => {
    const card = event.player.findByName("chosenCards")
      .childrenArray[0] as ClassicCard
    const source = event.player.findByName("chosenCards")
    const target = state.entities.findByName("mainPile")

    return [
      new cmd.ChangeParent(card, source, target),
      new cmd.ShowCard(card),
      new IncreaseAtackPoints(5),
      // Variant here
      card.suit === "H" ? new cmd.NextPlayer() : new cmd.PreviousPlayer()
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
  getConditions: (_, event: ServerPlayerEvent) => {
    const choosenCards = event.player.findByName("chosenCards")
    return [
      con.hasChildren(choosenCards),
      con.childrenOf(choosenCards).matchRank("4"),
      con.NOT(isAtWar),
      con.isPlayersTurn
    ]
  },
  getCommands: (state: State, event: ServerPlayerEvent) => {
    const cards = event.player.findByName("chosenCards")
      .childrenArray as ClassicCard[]
    const source = event.player.findByName("chosenCards")
    const target = state.entities.findByName("mainPile")

    return [
      new cmd.ChangeParent(cards, source, target),
      new cmd.ShowCard(cards),
      new IncreaseSkipPoints(cards.length),
      new cmd.NextPlayer()
    ]
  }
}

export const PlayAce: ActionTemplate = {
  name: "PlayAce",
  getInteractions: () => [
    {
      type: "pile",
      name: "mainPile"
    }
  ],
  getConditions: (_, event: ServerPlayerEvent) => {
    const choosenCards = event.player.findByName("chosenCards")
    return [
      con.hasChildren(choosenCards),
      con.childrenOf(choosenCards).matchRank("A"),
      con.NOT(isAtWar),
      con.isPlayersTurn
    ]
  },
  getCommands: (state: State, event: ServerPlayerEvent) => {
    const cards = event.player.findByName("chosenCards")
      .childrenArray as ClassicCard[]
    const source = event.player.findByName("chosenCards")
    const target = state.entities.findByName("mainPile")

    return [
      new cmd.ChangeParent(cards, source, target),
      new cmd.ShowCard(cards),
      new RevealUI("requerstSuit")
      // To be continued in RequestSuit action...
    ]
  }
}

export const RequestSuit: ActionTemplate = {
  name: "RequestSuit",
  getInteractions: () => [
    {
      $targetType: "UIButton",
      type: "UI.button"
    }
  ],
  getConditions: () => [],
  getCommands: (state: State, event: ServerPlayerEvent) => {
    return [
      new SetRequestedSuit(event.targetType),
      new HideUI("requerstSuit"),
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
  getConditions: (_, event: ServerPlayerEvent) => {
    const choosenCards = event.player.findByName("chosenCards")
    return [
      con.hasChildren(choosenCards),
      con.OR(
        // All non-functional cards
        con
          .childrenOf(choosenCards)
          .matchRank(["5", "6", "7", "8", "9", "10", "Q"]),
        // Non-functional kings
        con.AND(
          con.childrenOf(choosenCards).matchRank("K"),
          con.childrenOf(choosenCards).matchSuit(["C", "D"])
        )
      ),
      con.NOT(isAtWar),
      con.isPlayersTurn
    ]
  },
  getCommands: (state: State, event: ServerPlayerEvent) => {
    const cards = event.player.findByName("chosenCards")
      .childrenArray as ClassicCard[]
    const source = event.player.findByName("chosenCards")
    const pile = state.entities.findByName("mainPile")

    return [
      new cmd.ChangeParent(cards, source, pile),
      new cmd.ShowCard(cards),
      new cmd.NextPlayer()
    ]
  }
}

export const DrawCards: ActionTemplate = {
  name: "DrawCards",
  description: `Player may draw 1 card if he can't do anything, OR he'll be forced to pull more cards after he can't defend the atack points.`,
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
