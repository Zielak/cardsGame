import { logs, def } from "@cardsgame/utils"

import {
  Command,
  Target,
  TargetHolder,
  Targets,
  TargetsHolder
} from "../command"
import { State } from "../state"
import { ParentTrait, isParent } from "../traits/parent"
import { ChangeParent } from "./changeParent"

export class DealCards extends Command {
  private source: TargetHolder<ParentTrait>
  private targets: TargetsHolder<ParentTrait>

  private count: number
  private step: number
  private onDeckEmptied: () => Command

  /**
   * Deals `count` cards from this container to other containers.
   * Eg. hands
   *
   * @param source will take cards from here
   * @param targets and put them in these containers
   * @param {DealCardsOptions} options
   * @param {number} options.count how many cards should I deal for each target in total?
   * @param {number} options.step number of cards on each singular deal
   */
  constructor(
    source: Target<ParentTrait>,
    targets: Targets<ParentTrait>,
    options: DealCardsOptions = {}
  ) {
    super("DealCards")
    this.source = new TargetHolder<ParentTrait>(source)
    this.targets = new TargetsHolder<ParentTrait>(targets)

    this.count = def(options.count, Infinity)
    this.step = def(options.step, 1)
    this.onDeckEmptied = options.onDeckEmptied
  }

  async execute(state: State) {
    const _ = this.constructor.name
    logs.notice(_, "count:", this.count, ", step:", this.step)
    let targetI = 0
    let stepI = 0

    const maxDeals = this.count * this.targets.length
    const next = async () => {
      const top = this.source.getTop()
      if (isParent(top)) {
        logs.warn(
          "DealCards",
          `Unlikely situation, you're making me deal a CONTAINER (IParent) instead of singular object. Is that really what you want?`
        )
        return
      }
      const currentTarget = this.targets[targetI % this.targets.length]

      // This command thing moves the entity
      new ChangeParent(top, currentTarget).execute(state)

      // Pick next target if we dealt `this.step` cards to current target
      if (++stepI % this.step === 0) {
        targetI++
      }
      if (this.source.countChildren() > 0 && targetI < maxDeals) {
        next()
      } else {
        logs.notice(_, `Done dealing cards.`)
      }
    }
    return await next()
    // state.logTreeState()
  }
}

interface DealCardsOptions {
  count?: number
  step?: number
  onDeckEmptied?: () => Command
}
