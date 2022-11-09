import { Command, Targets, TargetsHolder } from "../command.js"
import type { Room } from "../room/base.js"
import type { State } from "../state/state.js"
import type { TwoSidedTrait } from "../traits/twoSided.js"

// Make it possible to provide functions as target...

/**
 * Reveal the front side (overse) of an element
 */
export class FaceUp extends Command {
  targets: TargetsHolder<TwoSidedTrait>

  constructor(entities: Targets<TwoSidedTrait>) {
    super()
    this.targets = new TargetsHolder<TwoSidedTrait>(entities)
  }

  async execute(state: State, room: Room<any>): Promise<void> {
    this.targets.get().forEach((e) => e.flipUp())
  }

  async undo(state: State, room: Room<any>): Promise<void> {
    this.targets.get().forEach((e) => e.flipDown())
  }
}

/**
 * Reveal the back side (revers) of an element
 */
export class FaceDown extends Command {
  targets: TargetsHolder<TwoSidedTrait>

  constructor(entities: Targets<TwoSidedTrait>) {
    super()
    this.targets = new TargetsHolder<TwoSidedTrait>(entities)
  }

  async execute(state: State, room: Room<any>): Promise<void> {
    this.targets.get().forEach((e) => e.flipDown())
  }

  async undo(state: State, room: Room<any>): Promise<void> {
    this.targets.get().forEach((e) => e.flipUp())
  }
}

/**
 * Flip the element to reveal its other side
 */
export class Flip extends Command {
  targets: TargetsHolder<TwoSidedTrait>

  constructor(entities: Targets<TwoSidedTrait>) {
    super()
    this.targets = new TargetsHolder<TwoSidedTrait>(entities)
  }

  async execute(state: State, room: Room<any>): Promise<void> {
    this.targets.get().forEach((e) => e.flip())
  }

  async undo(state: State, room: Room<any>): Promise<void> {
    this.targets.get().forEach((e) => e.flip())
  }
}
