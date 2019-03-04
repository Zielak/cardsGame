import { State } from "../state"
import { Card } from "../entities/card"
import { logs } from "../logs"
import { ICommand } from "../command"

export class HideCard implements ICommand {
  constructor(private card: Card) {}
  execute(state: State) {
    logs.log(`${this.constructor.name}`, "executing")
    this.card.hide()
    state.logTreeState()
  }
  undo(state: State) {
    this.card.show()
  }
}
