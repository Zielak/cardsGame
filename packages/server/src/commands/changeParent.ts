import { State } from "../state"
import { logs, chalk } from "@cardsgame/utils"
import { Command } from "../command"
import { ChildTrait } from "../traits/child"
import { ParentTrait, hasLabel } from "../traits"

export class ChangeParent extends Command {
  _name = "ChangeParent"

  private entities: ChildTrait[]
  private sources: ParentTrait[]
  private target: ParentTrait
  private prepend: boolean

  constructor(
    ents: ChildTrait | ChildTrait[],
    target: ParentTrait,
    prepend = false
  ) {
    super()

    this.entities = Array.isArray(ents) ? ents : [ents]
    this.sources = []
    this.target = target
    this.prepend = prepend

    if (this.entities.length < 1 || !this.target) {
      throw new Error(`I'm missing something...`)
    }
  }

  async execute(state: State) {
    const _ = this.constructor.name
    if (this.entities.length < 1) {
      logs.error("ChangeParent command", `I don't have an entity to move!`)
      return
    }
    logs.notice(
      _,
      "moving",
      this.entities.map(e => (hasLabel(e) ? e.name : "")),
      "entities to",
      chalk.yellow(this.target["name"] || "ROOT")
    )

    this.entities.forEach((entity, idx) => {
      this.sources[idx] = entity.parent
      this.target.addChild(entity, this.prepend)
    })
  }

  async undo(state: State) {
    this.entities.forEach((entity, idx) => {
      this.sources[idx].addChild(entity)
    })
  }
}
