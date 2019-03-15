import { State } from "../state"
import { BaseCard } from "../entities/baseCard"
import { logs } from "../logs"
import { ICommand } from "../command"

export class ShowCard implements ICommand {
  cards: BaseCard[]

  constructor(card: BaseCard)
  constructor(cards: BaseCard[])
  constructor(_cards: BaseCard | BaseCard[]) {
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
