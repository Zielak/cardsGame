import {
  conditions as con,
  commands as cmd,
  ServerPlayerEvent,
  Deck,
  logs,
  ActionTemplate,
  countChildren,
  IParent,
  ClassicCard,
  getChildren,
  Hand,
  getTop
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
  description: `Selecting cards makes sure that cards match with the pile and/or.
  with currently requested cards.
  No need to keep checking for it in other actions.`,
  getInteractions: (state: MakaoState) => {
    if (state.atackPoints > 0) {
      // 2,3,K? you shall only play atack cards
      return [
        { type: "classicCard", rank: ["2", "3"] },
        { type: "classicCard", rank: "K", suit: ["H", "S"] }
      ]
    } else if (state.skipPoints > 0) {
      // 4? you shant play any other cards
      return [{ type: "classicCard", rank: "4" }]
    } else if (state.requestedRank) {
      // J? you should only play what was requested or another J
      return [{ type: "classicCard", rank: state.requestedRank }]
    } else if (state.requestedSuit) {
      // A? you should only play requested suit OR other Ace
      return [
        { type: "classicCard", suit: state.requestedSuit },
        { type: "classicCard", rank: "A" }
      ]
    }
    return [{ type: "classicCard" }]
  },
  getConditions: (state: MakaoState, { player }: ServerPlayerEvent) => {
    const conditions = [
      con.isOwner,
      con.isPlayersTurn,
      con.parentMatches({ name: "playersHand" }),
      // You can't go selecting cards when you have unfinished
      // bussiness with the UI.
      con.NOT(con.hasRevealedUI(["suitPicker", "rankPicker"]))
    ]

    const myChosenCards = state.entities.find<IParent>({
      name: "chosenCards",
      owner: player
    })
    const pileTop = getTop(
      state.entities.find<Hand>({
        name: "mainPile"
      })
    )

    if (countChildren(myChosenCards) === 0) {
      conditions.push(
        con.OR(
          `First card should match anything on Pile`,
          state.requestedRank
            ? con.propEquals("rank", state.requestedRank)
            : con.matchesPropWith("rank", pileTop),
          state.requestedSuit
            ? con.propEquals("suit", state.requestedSuit)
            : con.matchesPropWith("suit", pileTop)
        )
      )
    } else {
      // The rest should match anything already selected
      conditions.push(con.matchesPropWith("rank", getChildren(myChosenCards)))
    }
    return conditions
  },
  getCommands: (
    { entities }: MakaoState,
    { player, entity }: ServerPlayerEvent
  ) => {
    const playersHand = entities.find<IParent>({
      owner: player,
      name: "playersHand"
    })
    const chosenCardsRow = entities.find<IParent>({
      owner: player,
      name: "chosenCards"
    })

    return new cmd.ChangeParent(entity, playersHand, chosenCardsRow)
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
    con.parentMatches({ name: "chosenCards" })
  ],
  getCommands: (
    { entities }: MakaoState,
    { player, entity }: ServerPlayerEvent
  ) => {
    const playersHand = entities.find<IParent>({
      owner: player,
      name: "playersHand"
    })
    const chosenCardsRow = entities.find<IParent>({
      owner: player,
      name: "chosenCards"
    })

    if (entity.idx > 0) {
      return new cmd.ChangeParent(entity, chosenCardsRow, playersHand)
    } else {
      const allChosenCards = getChildren(chosenCardsRow)
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
  getConditions: ({ entities }: MakaoState, { player }: ServerPlayerEvent) => {
    const choosenCards = entities.find<IParent>({
      name: "chosenCards",
      owner: player
    })
    return [
      con.hasChildren(choosenCards),
      con.childrenOf(choosenCards).matchRank(["2", "3"]),
      con.isPlayersTurn
    ]
  },
  getCommands: (
    { entities, pile }: MakaoState,
    { player }: ServerPlayerEvent
  ) => {
    const source = entities.find<IParent>({
      owner: player,
      name: "chosenCards"
    })
    const cards = getChildren<ClassicCard>(source)
    const target = pile

    return [
      new cmd.ChangeParent(cards, source, target),
      new cmd.FaceUp(cards),
      new IncreaseAtackPoints(parseInt(cards[0].rank) * cards.length),

      new SetRequestedSuit(undefined),
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
  getConditions: ({ entities }: MakaoState, { player }: ServerPlayerEvent) => {
    const choosenCards = entities.find<IParent>({
      name: "chosenCards",
      owner: player
    })
    return [
      con.hasChildren(choosenCards),
      con.childrenOf(choosenCards).matchRank("K"),
      con.childrenOf(choosenCards).matchSuit(["S", "H"]),
      con.isPlayersTurn
    ]
  },
  getCommands: (
    { entities, pile }: MakaoState,
    { player }: ServerPlayerEvent
  ) => {
    const source = entities.find<IParent>({
      owner: player,
      name: "chosenCards"
    })
    const card = getChildren<ClassicCard>(source)
    const target = pile

    return [
      new cmd.ChangeParent(card, source, target),
      new cmd.FaceUp(card),
      new IncreaseAtackPoints(5),

      new SetRequestedSuit(undefined),
      // Variant here
      card[0].suit === "H" ? new cmd.NextPlayer() : new cmd.PreviousPlayer()
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
  getConditions: ({ entities }: MakaoState, { player }: ServerPlayerEvent) => {
    const choosenCards = entities.find<IParent>({
      name: "chosenCards",
      owner: player
    })
    return [
      con.hasChildren(choosenCards),
      con.childrenOf(choosenCards).matchRank("4"),
      con.NOT(isAtWar),
      con.isPlayersTurn
    ]
  },
  getCommands: (
    { entities, pile }: MakaoState,
    { player }: ServerPlayerEvent
  ) => {
    const source = entities.find<IParent>({
      owner: player,
      name: "chosenCards"
    })
    const cards = getChildren<ClassicCard>(source)
    const target = pile

    return [
      new cmd.ChangeParent(cards, source, target),
      new cmd.FaceUp(cards),
      new IncreaseSkipPoints(cards.length),

      new SetRequestedSuit(undefined),
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
  getConditions: ({ entities }: MakaoState, { player }: ServerPlayerEvent) => {
    const choosenCards = entities.find<IParent>({
      owner: player,
      name: "chosenCards"
    })
    return [
      con.hasChildren(choosenCards),
      con.childrenOf(choosenCards).matchRank("A"),
      con.NOT(isAtWar),
      con.isPlayersTurn
    ]
  },
  getCommands: (
    { entities, pile }: MakaoState,
    { player }: ServerPlayerEvent
  ) => {
    const source = entities.find<IParent>({
      owner: player,
      name: "chosenCards"
    })
    const cards = getChildren<ClassicCard>(source)
    const target = pile

    return [
      new cmd.ChangeParent(cards, source, target),
      new cmd.FaceUp(cards),
      new RevealUI("suitPicker")
      // To be continued in RequestSuit action...
    ]
  }
}

export const RequestSuit: ActionTemplate = {
  name: "RequestSuit",
  getInteractions: () => [
    {
      command: "requestSuit"
    }
  ],
  getConditions: () => [],
  getCommands: (state: MakaoState, event: ServerPlayerEvent) => {
    return [
      new SetRequestedSuit(event.data),
      new HideUI("suitPicker"),
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
  getConditions: ({ entities }: MakaoState, { player }: ServerPlayerEvent) => {
    const choosenCards = entities.find<IParent>({
      owner: player,
      name: "chosenCards"
    })
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
  getCommands: ({ entities }: MakaoState, { player }: ServerPlayerEvent) => {
    const source = entities.find<IParent>({
      owner: player,
      name: "chosenCards"
    })
    const cards = getChildren<ClassicCard>(source)
    const pile = entities.find<IParent>({
      name: "mainPile",
      type: "pile"
    })

    return [
      new cmd.ChangeParent(cards, source, pile),
      new cmd.FaceUp(cards),

      new SetRequestedSuit(undefined),
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
    const deck = event.entity as Deck
    const target = state.entities.find<IParent>({
      // name: "playersHand",
      type: "hand",
      owner: event.player
    })

    logs.log(
      "DrawCards",
      "atk:",
      state.atackPoints,
      "=>",
      Math.max(1, state.atackPoints)
    )
    return [
      new cmd.DealCards(deck, target, Math.max(1, state.atackPoints)),
      state.atackPoints > 0 ? new SetAtackPoints(0) : new cmd.Noop(),
      new cmd.NextPlayer()
    ]
  }
}
