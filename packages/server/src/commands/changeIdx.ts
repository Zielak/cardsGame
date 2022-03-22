import { logs } from "@cardsgame/utils"

import { Command, Targets, TargetsHolder } from "../command"
import type { State } from "../state"
import type { ChildTrait } from "../traits/child"
import { hasLabel } from "../traits/label"

export class ChangeIdx extends Command {
  // FIXME: I keep holding references to objects! Maybe I should remember just to indexes?
  private entities: TargetsHolder<ChildTrait>

  /**
   * History of card movement:
   * [index before execution, index after]
   */
  private sources: number[][]

  constructor(entities: Targets<ChildTrait>, private index: number) {
    super()

    this.entities = new TargetsHolder<ChildTrait>(entities)
    if (this.entities.get().some((e, _, all) => e.parent !== all[0].parent)) {
      throw new Error("ChangeIdx | not all entities come from the same parent")
    }
    this.sources = []
  }

  async execute(state: State): Promise<void> {
    const _ = this.constructor.name
    const entities = this.entities.get()
    if (entities.length < 1) {
      logs.error("ChangeIdx", `I don't have an entity to move!`)
      return
    }
    logs.log(
      _,
      "moving",
      entities.map((e) => (hasLabel(e) ? e.name : "")),
      `entities to index:`,
      this.index
    )

    const parent = entities[0].parent
    let from: number, to: number
    entities.forEach((entity, idx) => {
      from = entity.idx + idx
      to = this.index + idx
      this.sources[idx] = [from, to]

      parent.moveChildTo(from, to)
    })
  }

  async undo(state: State): Promise<void> {
    // to undo this [3 => 1]
    // you need to perform [1 => 4]

    const entities = this.entities.get()
    const parent = entities[0].parent
    for (let idx = this.sources.length - 1; idx >= 0; idx--) {
      const [pre, post] = this.sources[idx]
      parent.moveChildTo(post, pre)
    }

    // this.entities.get().forEach((entity, idx) => {
    //   const last = this.sources[idx]
    //   last[0].addChild(entity, last[1])
    // })
  }
}
