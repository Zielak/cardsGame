import { State } from "../state"
import { Command, Target, TargetHolder } from "../command"
import { ParentTrait } from "../traits/parent"

export class ShuffleChildren extends Command {
  target: TargetHolder<ParentTrait>

  constructor(container: Target<ParentTrait>) {
    super("ShuffleChildren")
    this.target = new TargetHolder(container)
  }

  async execute(state: State) {
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
}
