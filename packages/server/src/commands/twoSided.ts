import { State } from "../state"
import { Command } from "../command"
import { TwoSidedTrait } from "../traits/twoSided"

/**
 * Reveal the front side (overse) of an element
 */
export class FaceUp extends Command {
  _name = "FaceUp"

  entities: TwoSidedTrait[]

  constructor(entity: TwoSidedTrait)
  constructor(entities: TwoSidedTrait[])
  constructor(_entities: TwoSidedTrait | TwoSidedTrait[]) {
    super()
    this.entities = Array.isArray(_entities) ? _entities : [_entities]
  }
  async execute(state: State) {
    this.entities.forEach(e => e.flipUp())
  }
  async undo(state: State) {
    this.entities.forEach(e => e.flipDown())
  }
}

/**
 * Reveal the back side (revers) of an element
 */
export class FaceDown extends Command {
  _name = "FaceDown"

  entities: TwoSidedTrait[]
  constructor(entity: TwoSidedTrait)
  constructor(entities: TwoSidedTrait[])
  constructor(_entities: TwoSidedTrait | TwoSidedTrait[]) {
    super()
    this.entities = Array.isArray(_entities) ? _entities : [_entities]
  }

  async execute(state: State) {
    this.entities.forEach(e => e.flipDown())
  }

  async undo(state: State) {
    this.entities.forEach(e => e.flipUp())
  }
}

/**
 * Flip the element to reveal its other side
 */
export class Flip extends Command {
  _name = "Flip"

  entities: TwoSidedTrait[]
  constructor(entity: TwoSidedTrait)
  constructor(entities: TwoSidedTrait[])
  constructor(_entities: TwoSidedTrait | TwoSidedTrait[]) {
    super()
    this.entities = Array.isArray(_entities) ? _entities : [_entities]
  }

  async execute(state: State) {
    this.entities.forEach(e => e.flip())
  }

  async undo(state: State) {
    this.entities.forEach(e => e.flip())
  }
}
