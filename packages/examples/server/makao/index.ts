import {
  ActionTemplate,
  Room,
  Player,
  Hand,
  Pile,
  Deck,
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
  PlaySkipTurn,
  PlayNormalCards,
  DeselectCard,
  SelectCard,
  PlayAce,
  RequestSuit
} from "./actions"

export class MakaoRoom extends Room<MakaoState> {
  name = "Makao"

  // Order of definition matters.
  possibleActions = new Set<ActionTemplate>([
    // UI related actions
    RequestSuit,

    // Entity-related actions
    SelectCard,
    DeselectCard,
    DrawCards,
    Atack23,
    AtackKing,
    PlaySkipTurn,
    PlayAce,
    PlayNormalCards
  ])

  // Some references for main game containers
  pile: Pile
  deck: Deck

  onSetupGame(state: MakaoState) {
    logs.info("Makao", `setting up the game`)
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

    state.on(MakaoState.events.playerTurnStarted, () => {
      const current = state.currentPlayer.clientID

      // [4] Check turn skips, if this player should keep on waiting
      if (state.turnSkips[current] > 0) {
        state.turnSkips[current]--
        this.commandsManager.execute(state, new commands.NextPlayer())
      }
    })
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
    new commands.FlipCard(this.pile.top as ClassicCard).execute(state)

    // debug, all players get aces
    playersHands
      .map(() => [
        new ClassicCard({ state, suit: "D", rank: "A", parent: this.deck }),
        new ClassicCard({ state, suit: "H", rank: "A", parent: this.deck }),
        new ClassicCard({ state, suit: "C", rank: "A", parent: this.deck }),
        new ClassicCard({ state, suit: "S", rank: "A", parent: this.deck })
      ])
      .reduce((prev, next) => {
        prev.push(...next)
        return prev
      }, [])
    new commands.DealCards(this.deck, playersHands, 1, 4).execute(state)

    logs.info("Final state HELLO")
    state.logTreeState()
  }
}
