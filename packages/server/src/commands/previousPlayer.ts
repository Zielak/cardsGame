import { State } from "../state"
import { logs } from "../logs"
import { ICommand } from "."

export class PreviousPlayer implements ICommand {
  execute(state: State) {
    // TODO: move these logs outside...
    const _ = this.constructor.name
    logs.log(_, "executing")
    const current = state.currentPlayerIdx
    const next: number =
      current - 1 === -1 ? state.playersCount - 1 : current - 1

    state.currentPlayerIdx = next
    logs.log(_, `now it's ${state.currentPlayer.clientID} player turn`)
    // state.logTreeState()
  }
}
