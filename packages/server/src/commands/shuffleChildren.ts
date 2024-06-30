import type { State } from "@/state/state.js"
import type { ParentTrait } from "@/traits/parent.js"

import { Command, Target, TargetHolder } from "../command.js"

export class ShuffleChildren extends Command {
  target: TargetHolder<ParentTrait>

  constructor(container: Target<ParentTrait>) {
    super()
    this.target = new TargetHolder(container)
  }

  async execute(state: State): Promise<void> {
    let idxA = this.target.get().countChildren()
    if (idxA === 0) return
    while (--idxA) {
      const idxB = Math.floor(Math.random() * (idxA + 1))

      if (idxA > idxB) {
        this.target.get().moveChildTo(idxA, idxB)
        this.target.get().moveChildTo(idxB + 1, idxA)
      }
    }
  }

  async undo(state: State): Promise<void> {
    // TODO: implement and test
  }
}
