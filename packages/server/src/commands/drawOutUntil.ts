import { def } from "@cardsgame/utils"

import { Command, Target, TargetHolder } from "../command.js"
import type { Room } from "../room/base.js"
import type { State } from "../state/state.js"
import type { ChildTrait } from "../traits/child.js"
import type { ParentTrait } from "../traits/parent.js"

import { ChangeParent } from "./changeParent.js"
import { FaceDown, FaceUp, Flip } from "./twoSided.js"
import { Wait } from "./wait.js"

type DrawOutCondition = (child: ChildTrait) => boolean

type DrawOutOptions = {
  flip?: boolean
  faceUp?: boolean
  delay?: number
}

export class DrawOutUntil extends Command {
  private source: TargetHolder<ParentTrait>
  private target: TargetHolder<ParentTrait>
  private condition: DrawOutCondition
  private options: DrawOutOptions

  constructor(
    source: Target<ParentTrait>,
    target: Target<ParentTrait>,
    condition: DrawOutCondition,
    options?: DrawOutOptions,
  ) {
    super()

    this.source = new TargetHolder<ParentTrait>(source)
    this.target = new TargetHolder<ParentTrait>(target)
    this.condition = condition
    this.options = def(options, {})
  }

  async execute(state: State, room: Room<any>): Promise<void> {
    const source = this.source.get()
    const target = this.target.get()

    if (!source) {
      throw new Error(`DrawOutUntil command. Source is required.`)
    }
    if (!target) {
      throw new Error(`DrawOutUntil command. Target is required.`)
    }
    if (!this.condition) {
      throw new Error(`DrawOutUntil command. Condition is required.`)
    }

    const { faceUp, flip, delay } = this.options
    let entity
    do {
      entity = source.getTop()
      this.subExecute(state, room, new ChangeParent(entity, target))

      if ("faceUp" in this.options) {
        if (faceUp) {
          this.subExecute(state, room, new FaceUp(entity))
        } else {
          this.subExecute(state, room, new FaceDown(entity))
        }
      }
      if (flip) {
        this.subExecute(state, room, new Flip(entity))
      }
      if (delay) {
        await this.subExecute(state, room, new Wait(delay))
      }
    } while (!this.condition(entity))
  }

  async undo(state: State, room: Room<any>): Promise<void> {
    // Handled fully with subcommands
    super.undo(state, room)
  }
}
