import { logs } from "../logs"
import { State } from "../state"
import { ICommand } from "."
import {
  IParent,
  countChildren,
  restyleChildren,
  getChild,
  removeChildAt,
  addChild
} from "../entities/traits/parent"

export class ShuffleChildren implements ICommand {
  constructor(private container: IParent) {}

  execute(state: State) {
    logs.log(`${this.constructor.name}`, "executing")

    let fromIdx = countChildren(this.container)
    if (fromIdx === 0) return
    while (--fromIdx) {
      const toIdx = Math.floor(Math.random() * (fromIdx + 1))
      const childi = getChild(this.container, fromIdx)
      const childj = getChild(this.container, toIdx)

      removeChildAt(this.container, fromIdx)
      addChild(this.container, childj, fromIdx)

      removeChildAt(this.container, toIdx + 1)
      addChild(this.container, childi, toIdx + 1)

      restyleChildren(this.container)
    }
    state.logTreeState()
  }
}
