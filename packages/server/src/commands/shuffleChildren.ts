import { logs } from "../logs"
import { State } from "../state"
import { ICommand } from "."
import {
  IParent,
  countChildren,
  restyleChildren,
  getChild,
  removeChildAt,
  addChild,
  moveChildTo
} from "../entities/traits/parent"

export class ShuffleChildren implements ICommand {
  constructor(private container: IParent) {}

  execute(state: State) {
    logs.log(`${this.constructor.name}`, "executing")

    let idxA = countChildren(this.container)
    if (idxA === 0) return
    while (--idxA) {
      const idxB = Math.floor(Math.random() * (idxA + 1))
      // const childi = getChild(this.container, idxA)
      // const childj = getChild(this.container, idxB)

      if (idxA > idxB) {
        moveChildTo(this.container, idxA, idxB)
        moveChildTo(this.container, idxB + 1, idxA)
      }
      // FIXME: remove? this condition will never launch
      // else if (idxB > idxA) {
      //   moveChildTo(this.container, idxA, idxB)
      //   moveChildTo(this.container, idxB + 1, idxA)
      // }

      restyleChildren(this.container)
    }
    state.logTreeState()
  }
}
