import { State } from "../state"
import { ICommand } from "."
import { faceUp, faceDown, flip, TwoSidedTrait } from "../traits/twoSided"

/**
 * Reveal the front side (overse) of an element
 */
export class FaceUp implements ICommand {
  entities: TwoSidedTrait[]

  constructor(entity: TwoSidedTrait)
  constructor(entities: TwoSidedTrait[])
  constructor(_entities: TwoSidedTrait | TwoSidedTrait[]) {
    this.entities = Array.isArray(_entities) ? _entities : [_entities]
  }
  execute(state: State) {
    this.entities.forEach(faceUp)
  }
  undo(state: State) {
    this.entities.forEach(faceDown)
  }
}

/**
 * Reveal the back side (revers) of an element
 */
export class FaceDown implements ICommand {
  entities: TwoSidedTrait[]
  constructor(entity: TwoSidedTrait)
  constructor(entities: TwoSidedTrait[])
  constructor(_entities: TwoSidedTrait | TwoSidedTrait[]) {
    this.entities = Array.isArray(_entities) ? _entities : [_entities]
  }

  execute(state: State) {
    this.entities.forEach(faceDown)
  }

  undo(state: State) {
    this.entities.forEach(faceUp)
  }
}

/**
 * Flip the element to reveal its other side
 */
export class Flip implements ICommand {
  entities: TwoSidedTrait[]
  constructor(entity: TwoSidedTrait)
  constructor(entities: TwoSidedTrait[])
  constructor(_entities: TwoSidedTrait | TwoSidedTrait[]) {
    this.entities = Array.isArray(_entities) ? _entities : [_entities]
  }

  execute(state: State) {
    this.entities.forEach(flip)
  }

  undo(state: State) {
    this.entities.forEach(flip)
  }
}
