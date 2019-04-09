import { def } from "@cardsgame/utils"
import { Container } from "./container"
import { Entity, IEntityOptions } from "./entity"

export class Row extends Container {
  type = "row"

  constructor(options: IEntityOptions) {
    super(options)
    this.width = def(options.width, 30)
  }

  // TODO: test it
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
