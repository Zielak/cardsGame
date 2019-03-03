import { State } from "../state"
import { Card } from "../entities/card"
import { logs } from "../logs"
import { ICommand } from "command"

export class FlipCard implements ICommand {
  constructor(private card: Card) {}
  execute(state: State) {
    logs.log(`${this.constructor.name}`, "executing")
    this.card.flip()
    state.logTreeState()
  }
  undo(state: State) {
    this.card.flip()
  }
}
