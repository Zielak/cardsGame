import { ICommand } from "@cardsgame/server"
import { ContainersTestState } from "../state"

export class ChangeCardPickedState implements ICommand {
  lastValue: boolean

  constructor(private value: boolean) {}

  execute(state: ContainersTestState) {
    this.lastValue = state.cardPicked
    state.cardPicked = this.value
  }

  undo(state: ContainersTestState) {
    state.cardPicked = this.lastValue
  }
}
