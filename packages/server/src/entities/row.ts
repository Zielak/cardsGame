import { Container } from "./container"
import { Entity, IEntityOptions } from "../entity"
import { def } from "@cardsgame/utils"

export class Row extends Container {
  type = "row"

  constructor(options: IEntityOptions) {
    super(options)
    this.width = def(options.width, 30)
  }

  restyleChild(child: Entity, idx: number, children: Entity[]) {
    const MAX = children.length
    const INTERVAL = Math.min(this.width / MAX, child.width)

    return {
      x: INTERVAL * idx - INTERVAL * (MAX / 2),
      y: 0,
      angle: 0
    }
  }
}
