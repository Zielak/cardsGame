import { logs } from "@cardsgame/utils"
import { ICommand } from "."
import { State } from "../state"
import { Room } from "../room"

export class NextRound implements ICommand {
  _name: string = "NextRound"

  execute(state: State, room: Room<any>) {
    room.onRoundEnd()

    state.round++
    logs.notice(this._name, `Round ${state.round}!`)

    room.onRoundStart()
  }

  undo(state: State, room: Room<any>) {
    room.onRoundStart()

    state.round--
    logs.notice(this._name, `Bringing back Round ${state.round}!`)

    room.onRoundEnd()
  }
}
