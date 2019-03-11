import { State } from "../state"
import { Entity } from "../entity"
import { Card } from "../entities/card"
import { Move } from "./move"
import { logs } from "../logs"
import { ICommand } from "../command"

export class DealCards implements ICommand {
  targets: Entity[]

  /**
   * Deals `count` cards from this container to other containers.
   * Eg. hands
   *
   * @param source will take cards from here
   * @param target and put them in these entities
   * @param count how many cards should I deal for each target?
   */
  constructor(
    private source: Entity,
    targets: Entity | Entity[],
    private count: number = Infinity
  ) {
    this.targets = Array.isArray(targets) ? targets : [targets]
  }

  execute(state: State) {
    const _ = this.constructor.name
    logs.log(_, "executing")
    let i = 0
    const maxDeals = this.count * this.targets.length
    const next = () => {
      const card = this.source.top as Card
      const currentTarget = this.targets[i % this.targets.length]

      // This command thing moves the entity
      new Move(card, this.source, currentTarget).execute(state)

      i++
      if (this.source.length > 0 && i < maxDeals) {
        // setTimeout(next, 500)
        next()
      } else {
        // resolve(`Deck: Done dealing cards.`)
        logs.log(_, `Done dealing cards.`)
      }
    }
    next()
    state.logTreeState()
  }
}
