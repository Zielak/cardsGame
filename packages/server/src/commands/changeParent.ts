import { IEntity } from "../entities/traits/entity"
import { State } from "../state"
import { logs } from "../logs"
import { ICommand } from "."
import { IParent, addChild } from "../entities/traits/parent"

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
    logs.log("┍━" + _, "executing")
    if (this.entities.length < 1) {
      logs.error("ChangeParent command", `I don't have an entity to move!`)
      return
    }
    logs.log(
      "│ " + _,
      "starting, moving",
      this.entities.map(e => e.name),
      "entities from",
      this.source.name,
      "to",
      this.target.name
    )

    this.entities.forEach(entity => addChild(this.target, entity))

    logs.log("┕━" + _, `done`)
    // state.logTreeState()
  }

  undo(state: State) {
    this.entities.forEach(entity => addChild(this.source, entity))
  }
}
