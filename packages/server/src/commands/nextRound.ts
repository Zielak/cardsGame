import { logs } from "@cardsgame/utils"
import { Command } from "../command"
import { State } from "../state"
import { Room } from "../room"

export class NextRound extends Command {
  _name = "NextRound"

  async execute(state: State, room: Room<any>) {
    room.onRoundEnd()

    state.round++
    logs.notice(this._name, `Round ${state.round}!`)

    room.onRoundStart()
  }

  async undo(state: State, room: Room<any>) {
    room.onRoundStart()

    state.round--
    logs.notice(this._name, `Bringing back Round ${state.round}!`)

    room.onRoundEnd()
  }
}
