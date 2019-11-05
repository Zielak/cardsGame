import { State } from "../state"
import { ICommand } from "."
import { ParentTrait } from "../traits/parent"

export class ShuffleChildren implements ICommand {
  constructor(private container: ParentTrait) {}

  execute(state: State) {
    let idxA = this.container.countChildren()
    if (idxA === 0) return
    while (--idxA) {
      const idxB = Math.floor(Math.random() * (idxA + 1))
      // const childi = getChild(this.container, idxA)
      // const childj = getChild(this.container, idxB)

      if (idxA > idxB) {
        this.container.moveChildTo(idxA, idxB)
        this.container.moveChildTo(idxB + 1, idxA)
      }
      // FIXME: remove? this condition will never launch
      // else if (idxB > idxA) {
      //   moveChildTo(this.container, idxA, idxB)
      //   moveChildTo(this.container, idxB + 1, idxA)
      // }
    }
  }
}
