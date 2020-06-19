import { logs } from "@cardsgame/utils"

import { Command } from "../command"
import { Room } from "../room"
import { State } from "../state/state"

export class NextRound extends Command {
  async execute(state: State, room: Room<any>): Promise<void> {
    room.onRoundEnd()

    state.round++
    logs.notice(this.name, `Round ${state.round}!`)

    room.onRoundStart()
    room.botRunner.onRoundStart()
  }

  async undo(state: State, room: Room<any>): Promise<void> {
    room.onRoundStart()

    state.round--
    logs.notice(this.name, `Bringing back Round ${state.round}!`)

    room.onRoundEnd()
  }
}
