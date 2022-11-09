import { logs } from "@cardsgame/utils"

import { Command } from "../command.js"
import type { Room } from "../room/base.js"
import type { State } from "../state/state.js"

export class NextRound extends Command {
  async execute(state: State, room: Room<any>): Promise<void> {
    room.onRoundEnd()

    state.round++
    logs.log(this.name, `Round ${state.round}!`)

    room.onRoundStart()
    room.botRunner.onRoundStart()
  }

  async undo(state: State, room: Room<any>): Promise<void> {
    room.onRoundStart()

    state.round--
    logs.log(this.name, `Bringing back Round ${state.round}!`)

    room.onRoundEnd()
  }
}
