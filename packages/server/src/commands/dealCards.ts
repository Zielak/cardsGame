import { State } from "../state"
import { logs } from "../logs"
import { ICommand } from "."
import { ChangeParent } from "./changeParent"
import { IParent, countChildren, getTop } from "../entities/traits/parent"

export class DealCards implements ICommand {
  targets: IParent[]

  /**
   * Deals `count` cards from this container to other containers.
   * Eg. hands
   *
   * @param source will take cards from here
   * @param targets and put them in these containers
   * @param count how many cards should I deal for each target in total?
   * @param step number of cards on each singular deal
   */
  constructor(
    private source: IParent,
    targets: IParent | IParent[],
    private count: number = Infinity,
    private step: number = 1
  ) {
    this.targets = Array.isArray(targets) ? targets : [targets]
  }

  execute(state: State) {
    const _ = this.constructor.name
    logs.log(_, "executing", "count:", this.count, ", step:", this.step)
    let targetI = 0
    let stepI = 0

    const maxDeals = this.count * this.targets.length
    const next = () => {
      const top = getTop(this.source)
      if (top.isParent()) {
        logs.warn(
          "DealCards",
          `Unlikely situation, you're making me deal a CONTAINER (IParent) instead of singular object. Is that really what you want?`
        )
        return
      }
      const currentTarget = this.targets[targetI % this.targets.length]

      // This command thing moves the entity
      new ChangeParent(top, this.source, currentTarget).execute(state)

      // Pick next target if we dealt `this.step` cards to current target
      if (++stepI % this.step === 0) {
        targetI++
      }
      if (countChildren(this.source) > 0 && targetI < maxDeals) {
        // setTimeout(next, 500)
        next()
      } else {
        logs.log(_, `Done dealing cards.`)
      }
    }
    next()
    state.logTreeState()
  }
}
