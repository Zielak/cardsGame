import { State } from "../state"
import { Entity } from "../entity"
import { BaseCard } from "../entities/baseCard"
import { logs } from "../logs"
import { ICommand } from "../command"
import { ChangeParent } from "./changeParent"

export class DealCards implements ICommand {
  targets: Entity[]

  /**
   * Deals `count` cards from this container to other containers.
   * Eg. hands
   *
   * @param source will take cards from here
   * @param targets and put them in these entities
   * @param count how many cards should I deal for each target in total?
   * @param step number of cards on each singular deal
   */
  constructor(
    private source: Entity,
    targets: Entity | Entity[],
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
      const card = this.source.top as BaseCard
      const currentTarget = this.targets[targetI % this.targets.length]

      // This command thing moves the entity
      new ChangeParent(card, this.source, currentTarget).execute(state)

      // Pick next target if we dealt `this.step` cards to current target
      if (++stepI % this.step === 0) {
        targetI++
      }
      if (this.source.length > 0 && targetI < maxDeals) {
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
