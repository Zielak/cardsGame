import { State } from "../state"
import { logs } from "../logs"
import { ICommand } from "command"

export class StartGame implements ICommand {
  execute(state: State) {
    const _ = this.constructor.name
    logs.log(_, "executing")
    state.isGameStarted = true
    state.currentPlayerIdx = 0
    logs.log(_, `${state.playersCount} players`)
    logs.log(_, `Current player is`, state.currentPlayer)
    state.logTreeState()
  }
}
