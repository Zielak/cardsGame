import { Entity } from "../entity"
import { logs } from "../logs"
import { State } from "../state"
import { notifyNewIdx } from "../entityMap"
import { ICommand } from "../command"

export class ShuffleChildren implements ICommand {
  constructor(private container: Entity) {}

  execute(state: State) {
    logs.log(`${this.constructor.name}`, "executing")

    let fromIdx = this.container.length
    if (fromIdx === 0) return
    while (--fromIdx) {
      const toIdx = Math.floor(Math.random() * (fromIdx + 1))
      const childi = this.container.children[fromIdx] as Entity
      const childj = this.container.children[toIdx] as Entity
      this.container.children[fromIdx] = childj
      this.container.children[toIdx] = childi
      notifyNewIdx(childi, toIdx)
      notifyNewIdx(childj, fromIdx)
    }
    state.logTreeState()
  }
}
