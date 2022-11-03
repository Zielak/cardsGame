import { def, logs } from "@cardsgame/utils"

import {
  Command,
  Target,
  TargetHolder,
  Targets,
  TargetsHolder,
} from "../command.js"
import type { Room } from "../room.js"
import type { State } from "../state/state.js"
import type { ParentTrait } from "../traits/parent.js"

import { ChangeParent } from "./changeParent.js"

/**
 * A command which by itself changes nothing,
 * but applies subCommands and executes these instead.
 */
export class DealCards extends Command {
  source: TargetHolder<ParentTrait>
  targets: TargetsHolder<ParentTrait>

  count: number
  step: number
  onEmptied: () => Command

  /**
   * Deals `count` cards from this container to other containers.
   * Eg. hands
   *
   * @param source will take cards from here
   * @param targets and put them in these containers
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
    this.onEmptied = options.onEmptied
  }

  async execute(state: State, room: Room<any>): Promise<void> {
    const _ = this.constructor.name
    logs.log(_, "count:", this.count, ", step:", this.step)

    let targetIter = 0
    let stepIdx = 0

    const source = this.source.get()
    const targets = this.targets.get()

    const maxDeals = this.count * targets.length

    let childrenLeft: number
    let currentTarget: ParentTrait

    do {
      childrenLeft = source.countChildren()
      if (childrenLeft > 0) {
        currentTarget = targets[targetIter % targets.length]
        // Move the entity
        await this.subExecute(
          state,
          room,
          new ChangeParent(() => source.getTop(), currentTarget)
        )

        // Pick next target if we dealt `this.step` cards to current target
        stepIdx++
        if (stepIdx % this.step === 0) {
          targetIter++
        }

        childrenLeft = source.countChildren()
      }

      if (childrenLeft === 0 && this.count !== Infinity) {
        // Try refilling the container
        const onEmptiedCommand = this.onEmptied && this.onEmptied()
        if (!onEmptiedCommand) {
          logs.warn(
            "DealCards",
            `Source emptied before dealing every requested card. Add onEmptied in options to for example refill the source with new entities.`
          )
          break
        } else {
          await this.subExecute(state, room, onEmptiedCommand)

          // Confirm it actually replenished the source
          childrenLeft = source.countChildren()
          if (childrenLeft === 0) {
            break
          }
        }
      }
    } while (
      (maxDeals === Infinity && childrenLeft > 0) ||
      (maxDeals !== Infinity && targetIter < maxDeals)
    )

    logs.log(_, `Done dealing cards.`)
  }
}

interface DealCardsOptions {
  /**
   * How many cards should I deal for each target in total?
   */
  count?: number
  /**
   * Number of cards on each singular deal
   */
  step?: number
  /**
   * Called when deck gets emptied before dealing out every requested card.
   * `count: Infinity` won't have this called.
   */
  onEmptied?: () => Command
}
