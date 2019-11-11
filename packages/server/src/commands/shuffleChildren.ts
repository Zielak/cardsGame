import { State } from "../state"
import { Command } from "../command"
import { ParentTrait } from "../traits/parent"

export class ShuffleChildren extends Command {
  _name = "ShuffleChildren"

  constructor(private container: ParentTrait) {
    super()
  }

  async execute(state: State) {
    let idxA = this.container.countChildren()
    if (idxA === 0) return
    while (--idxA) {
      const idxB = Math.floor(Math.random() * (idxA + 1))

      if (idxA > idxB) {
        this.container.moveChildTo(idxA, idxB)
        this.container.moveChildTo(idxB + 1, idxA)
      }
    }
  }
}
