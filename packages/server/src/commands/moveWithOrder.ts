import { ICommand } from "../command"
import { Container } from "../entities"
import { Entity } from "../entity"
import { logs } from "../logs"
import { State } from "../state"

/**
 * TODO: Probably not needed. Too complicated to be one command/action
 */
export class MoveWithOrder implements ICommand {
  private entities: Entity[]
  private source: Entity
  private target: Entity
  private orderingPlate: Container

  constructor(
    entity: Entity,
    source: Entity,
    target: Entity,
    orderingPlate: Container
  )
  constructor(
    entities: Entity[],
    source: Entity,
    target: Entity,
    orderingPlate: Container
  )
  constructor(
    ents: Entity | Entity[],
    source: Entity,
    target: Entity,
    orderingPlate: Container
  ) {
    this.entities = Array.isArray(ents) ? ents : [ents]
    this.source = source
    this.target = target
    this.orderingPlate = orderingPlate

    if (
      this.entities.length < 1 ||
      !this.source ||
      !this.target ||
      !this.orderingPlate
    ) {
      throw new Error(`All arguments are required!`)
    }
  }

  async execute(state: State) {
    const _ = this.constructor.name
    logs.log("┍━" + _, "executing")

    logs.log(
      `│ ` + _,
      `First, move ${this.entities.length} entities to orderingPlate(${
        this.orderingPlate.name
      })`
    )
    this.entities.forEach(entity => this.orderingPlate.addChild(entity))

    logs.log(
      `│ ` + _,
      `Now, wait for player to choose the next entity to move (somehow)`
    )

    logs.log("┕━" + _, `done`)
  }
}
