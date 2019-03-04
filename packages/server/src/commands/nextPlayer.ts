import { State } from "../state"
import { logs } from "../logs"
import { ICommand } from "../command"

export class NextPlayer implements ICommand {
  execute(state: State) {
    const _ = this.constructor.name
    logs.log(_, "executing")
    const current = state.currentPlayerIdx
    const next: number = current + 1 === state.playersCount ? 0 : current + 1

    state.currentPlayerIdx = next
    logs.log(_, `now it's ${state.currentPlayer} player turn`)
    // state.logTreeState()
  }
}
