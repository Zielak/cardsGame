import { chalk, def, logs } from "@cardsgame/utils"

import {
  Command,
  Target,
  TargetHolder,
  Targets,
  TargetsHolder,
} from "../command"
import { State } from "../state"
import { ChildTrait } from "../traits/child"
import { hasLabel } from "../traits/label"
import { ParentTrait } from "../traits/parent"

export class ChangeParent extends Command {
  private entities: TargetsHolder<ChildTrait>
  private target: TargetHolder<ParentTrait>
  private prepend: boolean
  private index: number

  private sources: [ParentTrait, number][]

  constructor(
    entities: Targets<ChildTrait>,
    target: Target<ParentTrait>,
    options: ChangeParentOptions = {}
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
    logs.notice(
      _,
      "moving",
      this.entities.get().map((e) => (hasLabel(e) ? e.name : "")),
      "entities to",
      chalk.yellow(this.target.get()["name"] || "ROOT")
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
