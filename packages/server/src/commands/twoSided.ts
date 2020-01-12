import { Command, TargetsHolder, Targets } from "../command"
import { TwoSidedTrait } from "../traits/twoSided"

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

  async execute(): Promise<void> {
    this.targets.get().forEach(e => e.flipUp())
  }

  async undo(): Promise<void> {
    this.targets.get().forEach(e => e.flipDown())
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

  async execute(): Promise<void> {
    this.targets.get().forEach(e => e.flipDown())
  }

  async undo(): Promise<void> {
    this.targets.get().forEach(e => e.flipUp())
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

  async execute(): Promise<void> {
    this.targets.get().forEach(e => e.flip())
  }

  async undo(): Promise<void> {
    this.targets.get().forEach(e => e.flip())
  }
}
