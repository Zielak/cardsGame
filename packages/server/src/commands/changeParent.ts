import { def } from "@cardsgame/utils"
import chalk from "chalk"

import type { State } from "@/state/state.js"
import type { ChildTrait } from "@/traits/child.js"
import { hasLabel } from "@/traits/label.js"
import type { ParentTrait } from "@/traits/parent.js"

import {
  Command,
  Target,
  TargetHolder,
  Targets,
  TargetsHolder,
} from "../command.js"
import { logs } from "../logs.js"

export class ChangeParent extends Command {
  private entities: TargetsHolder<ChildTrait>
  private target: TargetHolder<ParentTrait>
  private prepend: boolean
  private index: number

  private sources: [ParentTrait, number][]

  constructor(
    entities: Targets<ChildTrait>,
    target: Target<ParentTrait>,
    options: ChangeParentOptions = {},
  ) {
    super()

    this.entities = new TargetsHolder<ChildTrait>(entities)
    this.sources = []
    this.target = new TargetHolder<ParentTrait>(target)

    this.prepend = def(options.prepend, false)

    if (this.prepend && "index" in options) {
      throw new Error(`ChangeParent, You can't use "prepend" and specify index`)
    }

    this.index = def(options.index, undefined)
  }

  async execute(state: State): Promise<void> {
    const _ = this.constructor.name
    if (!this.target.get()) {
      throw new Error(`ChangeParent, Target is required.`)
    }
    if (this.entities.get().length < 1) {
      logs.error("ChangeParent", `I don't have an entity to move!`)
      return
    }
    logs.log(
      _,
      "moving",
      this.entities.get().map((e) => `${e.idx}:${hasLabel(e) ? e.name : ""}`),
      "entities to",
      chalk.yellow(this.target.get()["name"] || "ROOT"),
    )

    this.entities.get().forEach((entity, idx) => {
      this.sources[idx] = [entity.parent, entity.idx]
      this.target.get().addChild(entity, this.prepend || this.index)
    })
  }

  async undo(state: State): Promise<void> {
    this.entities.get().forEach((entity, idx) => {
      const last = this.sources[idx]
      last[0].addChild(entity, last[1])
    })
  }
}

type ChangeParentOptions = {
  prepend?: boolean
  index?: number
}
