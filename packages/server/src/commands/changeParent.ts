import { IEntity, setParent } from "../traits/entity"
import { State } from "../state"
import { logs } from "../logs"
import { ICommand } from "."
import { IParent } from "../traits/parent"
import chalk from "chalk"

export class ChangeParent implements ICommand {
  private entities: IEntity[]
  private source: IParent
  private target: IParent

  // constructor(entity: IEntity, source: IParent, target: IParent)
  // constructor(entities: IEntity[], source: IParent, target: IParent)
  constructor(ents: IEntity | IEntity[], source: IParent, target: IParent) {
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
    logs.log(
      "│ " + _,
      "starting, moving",
      this.entities.map(e => e.name),
      "entities from",
      chalk.yellow(this.source["name"] || "ROOT"),
      "to",
      chalk.yellow(this.target["name"] || "ROOT")
    )

    this.entities.forEach(entity => setParent(entity, this.target))

    // state.logTreeState()
  }

  undo(state: State) {
    this.entities.forEach(entity => setParent(entity, this.source))
  }
}
