import { State } from "../state"
import { logs } from "../logs"
import { ICommand } from "."
import { ITwoSided, faceUp, faceDown } from "../entities/traits/twoSided"

/**
 * Reveal the front side (overse) of an element
 */
export class FaceUp implements ICommand {
  entities: ITwoSided[]

  constructor(entity: ITwoSided)
  constructor(entities: ITwoSided[])
  constructor(_entities: ITwoSided | ITwoSided[]) {
    this.entities = Array.isArray(_entities) ? _entities : [_entities]
  }
  execute(state: State) {
    logs.log(`${this.constructor.name}`, "executing")
    this.entities.forEach(faceUp)
    state.logTreeState()
  }
  undo(state: State) {
    this.entities.forEach(faceDown)
  }
}

/**
 * Reveal the back side (revers) of an element
 */
export class FaceDown implements ICommand {
  entities: ITwoSided[]
  constructor(entity: ITwoSided)
  constructor(entities: ITwoSided[])
  constructor(_entities: ITwoSided | ITwoSided[]) {
    this.entities = Array.isArray(_entities) ? _entities : [_entities]
  }

  execute(state: State) {
    logs.log(`${this.constructor.name}`, "executing")
    this.entities.forEach(faceDown)
    state.logTreeState()
  }

  undo(state: State) {
    this.entities.forEach(faceUp)
  }
}

/**
 * Flip the element to reveal its other side
 */
export class Flip implements ICommand {
  entities: ITwoSided[]
  constructor(entity: ITwoSided)
  constructor(entities: ITwoSided[])
  constructor(_entities: ITwoSided | ITwoSided[]) {
    this.entities = Array.isArray(_entities) ? _entities : [_entities]
  }

  execute(state: State) {
    logs.log(`${this.constructor.name}`, "executing")
    this.entities.forEach(faceDown)
    state.logTreeState()
  }

  undo(state: State) {
    this.entities.forEach(faceUp)
  }
}
