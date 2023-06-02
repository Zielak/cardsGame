import { logs } from "@cardsgame/utils"

import { Command } from "../command.js"
import type { Room } from "../room/base.js"
import type { State } from "../state/state.js"

import { Sequence } from "./sequence.js"

export class NextRound extends Command {
  async execute(state: State, room: Room<any>): Promise<void> {
    const commandsPre = room.onRoundEnd()
    if (commandsPre) {
      this.subExecute(state, room, new Sequence("onRoundEnd", commandsPre))
    }

    state.round++
    logs.log(this.name, `Round ${state.round}!`)

    const commandsPost = room.onRoundStart()
    if (commandsPost) {
      this.subExecute(state, room, new Sequence("onRoundStart", commandsPost))
    }

    room.botRunner?.onRoundStart()
  }

  async undo(state: State, room: Room<any>): Promise<void> {
    state.round--
    logs.log(this.name, `Bringing back Round ${state.round}!`)
  }
}
