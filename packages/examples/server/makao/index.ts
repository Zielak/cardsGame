import {
  Card,
  ActionTemplate,
  Room,
  Player,
  Hand,
  Pile,
  Deck,
  Row,
  ClassicCard,
  standardDeck,
  commands,
  logs
} from "@cardsgame/server"

import { MakaoState } from "./state"
import {
  DrawCards,
  Atack23,
  AtackKing,
  SkipTurn,
  PlayNormalCards,
  DeselectCard,
  SelectCard
} from "./actions"

export class MakaoRoom extends Room<MakaoState> {
  name = "Makao"

  // Order of definition matters.
  possibleActions = new Set<ActionTemplate>([
    SelectCard,
    DeselectCard,
    DrawCards,
    Atack23,
    AtackKing,
    SkipTurn,
    PlayNormalCards
  ])

  // Some references for main game containers
  pile: Pile
  deck: Deck

  onSetupGame(state: MakaoState) {
    state.atackPoints = 0
    state.skipPoints = 0
    state.turnSkips = {}

    // Prepare deck of cards and main pile
    this.pile = new Pile({
      state,
      name: "mainPile",
      x: -60
    })

    this.deck = new Deck({
      state,
      name: "mainDeck",
      x: 60
    })
    standardDeck().forEach(data => {
      new ClassicCard({
        state,
        parent: this.deck.id,
        suit: data.suit,
        rank: data.rank
      })
    })

    logs.info("Final state")
    state.logTreeState()
  }

  onStartGame(state: MakaoState) {
    state.players.toArray().forEach(pd => (state.turnSkips[pd.clientID] = 0))

    // Temp container for picking/ordering cards.
    state.players
      .toArray()
      .map(data => data.entity)
      .forEach((player: Player) => {
        new Hand({
          state,
          y: -80,
          name: "chosenCards",
          parent: player.id
        })
      })

    // Hands of each player
    const playersHands = state.players
      .toArray()
      .map(data => data.entity)
      .map(
        (player: Player) =>
          new Hand({
            state,
            name: "playersHand",
            parent: player.id
          })
      )

    new commands.ShuffleChildren(this.deck).execute(state)
    new commands.DealCards(this.deck, playersHands, 5).execute(state)
    new commands.ChangeParent(this.deck.top, this.deck, this.pile).execute(
      state
    )
    new commands.FlipCard(this.pile.top as Card).execute(state)

    logs.info("Final state")
    state.logTreeState()
  }
}