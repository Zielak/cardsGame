import { State, Deck, Pile, Hand } from "@cardsgame/server"

export class SuperhotState extends State {
  playerDeck: Deck
  playerDiscard: Pile
  playerHand: Hand

  theLine: Row
  obstaclesDeck: Deck
  obstaclesDiscard: Pile

  bulletsDeck: Deck

  usedCards: Row
}
