import { logs, chalk } from "@cardsgame/utils"

import { State } from "../state"
import {
  Command,
  TargetsHolder,
  Targets,
  TargetHolder,
  Target
} from "../command"
import { ChildTrait } from "../traits/child"
import { ParentTrait } from "../traits/parent"
import { hasLabel } from "../traits/label"

export class ChangeParent extends Command {
  private entities: TargetsHolder<ChildTrait>
  private target: TargetHolder<ParentTrait>
  private prepend: boolean

  private sources: ParentTrait[]

  constructor(
    entities: Targets<ChildTrait>,
    target: Target<ParentTrait>,
    prepend = false
  ) {
    super()

    this.entities = new TargetsHolder<ChildTrait>(entities)
    this.sources = []
    this.target = new TargetHolder<ParentTrait>(target)
    this.prepend = prepend
  }

  async execute(state: State) {
    const _ = this.constructor.name
    if (!this.target.get()) {
      throw new Error(`ChangeParent command. Target is required.`)
    }
    if (this.entities.get().length < 1) {
      logs.error("ChangeParent command", `I don't have an entity to move!`)
      return
    }
    logs.notice(
      _,
      "moving",
      this.entities.get().map(e => (hasLabel(e) ? e.name : "")),
      "entities to",
      chalk.yellow(this.target.get()["name"] || "ROOT")
    )

    this.entities.get().forEach((entity, idx) => {
      this.sources[idx] = entity.parent
      this.target.get().addChild(entity, this.prepend)
    })
  }

  async undo(state: State) {
    this.entities.get().forEach((entity, idx) => {
      this.sources[idx].addChild(entity)
    })
  }
}
