import { State } from "../state"
import { Card } from "../entities/card"
import { logs } from "../logs"
import { ICommand } from "command"

export class ShowCard implements ICommand {
  cards: Card[]

  constructor(card: Card)
  constructor(cards: Card[])
  constructor(_cards: Card | Card[]) {
    this.cards = Array.isArray(_cards) ? _cards : [_cards]
  }
  execute(state: State) {
    logs.log(`${this.constructor.name}`, "executing")
    this.cards.forEach(card => card.show())
    state.logTreeState()
  }
  undo(state: State) {
    this.cards.forEach(card => card.hide())
  }
}
