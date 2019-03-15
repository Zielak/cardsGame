import { State } from "../state"
import { BaseCard } from "../entities/baseCard"
import { logs } from "../logs"
import { ICommand } from "../command"

export class HideCard implements ICommand {
  constructor(private card: BaseCard) {}
  execute(state: State) {
    logs.log(`${this.constructor.name}`, "executing")
    this.card.hide()
    state.logTreeState()
  }
  undo(state: State) {
    this.card.show()
  }
}
