import { logs } from "../logs"
import { State } from "../state"
import { ICommand } from "."
import {
  IParent,
  countChildren,
  restyleChildren,
  getChild
} from "../entities/traits/parent"

export class ShuffleChildren implements ICommand {
  constructor(private container: IParent) {}

  execute(state: State) {
    logs.log(`${this.constructor.name}`, "executing")

    let fromIdx = countChildren(this.container)
    if (fromIdx === 0) return
    while (--fromIdx) {
      const children = this.container._children

      const toIdx = Math.floor(Math.random() * (fromIdx + 1))
      const childi = children.get(fromIdx)
      const childj = children.get(toIdx)

      children.remove(fromIdx)
      children.add(childj, fromIdx)

      children.remove(toIdx + 1)
      children.add(childi, toIdx + 1)

      restyleChildren(this.container)
    }
    state.logTreeState()
  }
}
