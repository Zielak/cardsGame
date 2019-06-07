import {
  Room,
  Hand,
  State,
  Pile,
  Deck,
  ClassicCard,
  standardDeckFactory,
  ActionTemplate,
  logs
} from "@cardsgame/server"

import { MoveCards } from "./actions/moveCard"
import { PickCard } from "./actions/pickCard"
import { ContainersTestState } from "./state"

export class ContainersTest extends Room<ContainersTestState> {
  name = "ContainersTest"

  possibleActions = new Set<ActionTemplate>([PickCard, MoveCards])

  // Some aliases for main game containers
  middle: Hand
  pile: Pile
  deck: Deck
  hand: Hand

  onSetupGame(options: any = {}) {
    this.setState(
      new ContainersTestState({
        minClients: options.minClients || 1,
        maxClients: options.maxClients || 4,
        hostID: options.hostID
      })
    )
    const { state } = this

    this.middle = new Hand({
      state,
      name: "middle"
    })

    this.pile = new Pile({
      state,
      x: -120,
      y: -100
    })

    this.deck = new Deck({
      state,
      x: 120,
      y: -100
    })

    this.hand = new Hand({
      state,
      y: 120
    })

    // Make a bunch of cards
    standardDeckFactory(["2", "3", "4"], ["D", "C"])
      .map(options => ({
        ...options,
        state,
        faceUp: true,
        parent: this.pile.id
      }))
      .forEach(options => new ClassicCard(options))

    standardDeckFactory(["5", "6", "7"], ["C", "H"])
      .map(options => ({
        ...options,
        state,
        faceUp: true,
        parent: this.deck.id
      }))
      .forEach(options => new ClassicCard(options))

    standardDeckFactory(["8", "9", "10", "J"], ["H", "S"])
      .map(options => ({
        ...options,
        state,
        faceUp: true,
        parent: this.hand.id
      }))
      .forEach(options => new ClassicCard(options))

    logs.info("Final state")
    state.logTreeState()
  }

  onStartGame(state: State) {
    // TODO: Deal cards maybe

    logs.info("Final state")
    state.logTreeState()
  }
}
