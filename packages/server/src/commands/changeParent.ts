import { State } from "../state"
import { logs, chalk } from "@cardsgame/utils"
import { ICommand } from "."
import { ChildTrait } from "../traits/child"
import { ParentTrait, hasLabel } from "../traits"

export class ChangeParent implements ICommand {
  private entities: ChildTrait[]
  private source: ParentTrait
  private target: ParentTrait

  // constructor(entity: ChildTrait, source: ParentTrait, target: ParentTrait)
  // constructor(entities: ChildTrait[], source: ParentTrait, target: ParentTrait)
  constructor(
    ents: ChildTrait | ChildTrait[],
    source: ParentTrait,
    target: ParentTrait
  ) {
    this.entities = Array.isArray(ents) ? ents : [ents]
    this.source = source
    this.target = target

    if (this.entities.length < 1 || !this.source || !this.target) {
      throw new Error(`I'm missing something...`)
    }
  }

  execute(state: State) {
    const _ = this.constructor.name
    if (this.entities.length < 1) {
      logs.error("ChangeParent command", `I don't have an entity to move!`)
      return
    }
    logs.notice(
      _,
      "starting, moving",
      this.entities.map(e => (hasLabel(e) ? e.name : "")),
      "entities from",
      chalk.yellow(this.source["name"] || "ROOT"),
      "to",
      chalk.yellow(this.target["name"] || "ROOT")
    )

    this.entities.forEach(entity => this.target.addChild(entity))

    // state.logTreeState()
  }

  undo(state: State) {
    this.entities.forEach(entity => this.source.addChild(entity))
  }
}
