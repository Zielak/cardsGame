import { chalk, def, logs } from "@cardsgame/utils"

import { Command, Target, TargetHolder } from "../command.js"
import { isGrid } from "../entities/index.js"
import type { State } from "../state/state.js"
import type { ChildTrait } from "../traits/child.js"
import { hasLabel } from "../traits/label.js"
import type { ParentTrait } from "../traits/parent.js"

export class PlaceOnGrid extends Command {
  private entity: TargetHolder<ChildTrait>
  private target: TargetHolder<ParentTrait>
  private row: number
  private column: number

  private lastIndex: number
  private lastParent: ParentTrait

  constructor(
    entity: Target<ChildTrait>,
    target: Target<ParentTrait>,
    row: number,
    column: number
  ) {
    super()

    this.entity = new TargetHolder<ChildTrait>(entity)
    this.target = new TargetHolder<ParentTrait>(target)

    this.column = def(column, 0)
    this.row = def(row, 0)
  }

  async execute(state: State): Promise<void> {
    const _ = this.constructor.name
    const entity = this.entity.get()
    const target = this.target.get()

    if (!target) {
      throw new Error(`PlaceOnGrid, Target is required.`)
    }
    if (!isGrid(target)) {
      throw new Error(`PlaceOnGrid, Target must be Grid.`)
    }
    if (!entity) {
      throw new Error(`PlaceOnGrid, Entity is required.`)
    }

    logs.log(
      _,
      "moving",
      hasLabel(entity) ? `${entity.type}:${entity.name}` : "",
      "to",
      chalk.yellow(target["name"] || "ROOT")
    )

    this.lastIndex = entity.idx
    this.lastParent = entity.parent
    target.addChildAt(entity, this.column, this.row)
  }

  async undo(state: State): Promise<void> {
    const entity = this.entity.get()

    this.lastParent.addChild(entity, this.lastIndex)
  }
}
