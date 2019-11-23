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
import { ParentTrait, hasLabel } from "../traits"

export class ChangeParent extends Command {
  _name = "ChangeParent"

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

    if (!this.target) {
      throw new Error(`Target is required.`)
    }
  }

  async execute(state: State) {
    const _ = this.constructor.name
    if (this.entities.get().length < 1) {
      logs.error("ChangeParent command", `I don't have an entity to move!`)
      return
    }
    logs.notice(
      _,
      "moving",
      this.entities.get().map(e => (hasLabel(e) ? e.name : "")),
      "entities to",
      chalk.yellow(this.target["name"] || "ROOT")
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
