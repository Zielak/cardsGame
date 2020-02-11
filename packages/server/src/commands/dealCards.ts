import { logs, def } from "@cardsgame/utils"

import {
  Command,
  Target,
  TargetHolder,
  Targets,
  TargetsHolder
} from "../command"
import { State } from "../state"
import { ParentTrait } from "../traits/parent"
import { ChangeParent } from "./changeParent"
import { Room } from "../room"

/**
 * A command which by itself changes nothing,
 * but applies subCommands and executes these instead.
 */
export class DealCards extends Command {
  source: TargetHolder<ParentTrait>
  targets: TargetsHolder<ParentTrait>

  count: number
  step: number
  onDeckEmptied: () => Command[]

  /**
   * Deals `count` cards from this container to other containers.
   * Eg. hands
   *
   * @param source will take cards from here
   * @param targets and put them in these containers
   * @param {DealCardsOptions} options
   * @param {number=Infinity} options.count how many cards should I deal for each target in total?
   * @param {number=1} options.step number of cards on each singular deal
   */
  constructor(
    source: Target<ParentTrait>,
    targets: Targets<ParentTrait>,
    options: DealCardsOptions = {}
  ) {
    super()
    this.source = new TargetHolder<ParentTrait>(source)
    this.targets = new TargetsHolder<ParentTrait>(targets)

    this.count = def(options.count, Infinity)
    this.step = Math.max(def(options.step, 1), 1)
    this.onDeckEmptied = options.onDeckEmptied
  }

  async execute(state: State, room: Room<any>) {
    const _ = this.constructor.name
    logs.notice(_, "count:", this.count, ", step:", this.step)

    let targetI = 0
    let stepI = 0

    const source = this.source.get()
    const targets = this.targets.get()

    const maxDeals = this.count * targets.length

    let childrenLeft

    do {
      const currentTarget = targets[targetI % targets.length]

      // This command thing moves the entity
      await this.subExecute(
        state,
        room,
        new ChangeParent(() => source.getTop(), currentTarget)
      )
      childrenLeft = source.countChildren()

      // Pick next target if we dealt `this.step` cards to current target
      if (++stepI % this.step === 0) {
        targetI++
      }

      if (childrenLeft === 0 && targetI < maxDeals && maxDeals !== Infinity) {
        const emptiedCmds = this.onDeckEmptied && this.onDeckEmptied()
        if (!emptiedCmds) {
          throw new Error(
            `Source emptied before dealing every requested card. Add onDeckEmptied in options to for example refill the source with new entities.`
          )
        }
        await this.subExecute(
          state,
          room,
          new Command("onDeckEmptied", emptiedCmds)
        )
      }
    } while (
      (maxDeals === Infinity && childrenLeft > 0) ||
      (maxDeals !== Infinity && targetI < maxDeals)
    )

    logs.notice(_, `Done dealing cards.`)
  }
}

interface DealCardsOptions {
  count?: number
  step?: number
  onDeckEmptied?: () => Command[]
}
