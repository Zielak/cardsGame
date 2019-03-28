import { Graphics, Text } from "pixi.js"
import { ClassicCardView } from "./classicCardView"
import { EntityView } from "./entityView"
import { ClientEntityData, EntityData } from "@cardsgame/client/src/types"

export class RowView extends EntityView {
  disablesTargetingChildren = false

  // bg: Graphics
  // label: Text

  // constructor(data: ClientEntityData) {
  //   super(data)
  //   const PLUS_SIZE = 20
  //   this.bg = new Graphics()

  //   this.bg.beginFill(0xff0099, 0.1)
  //   this.bg.lineStyle(3, 0xff0099, 1)
  //   this.bg.drawRoundedRect(
  //     -ClassicCardView.width / 2 - PLUS_SIZE * 2,
  //     -ClassicCardView.height / 2 - PLUS_SIZE,
  //     ClassicCardView.width + PLUS_SIZE * 4,
  //     ClassicCardView.height + PLUS_SIZE * 2,
  //     32
  //   )
  //   this.label = new Text(labelText(this.data), {
  //     fill: ["#ffffff", "#ff66CC"],
  //     stroke: "#4a1850",
  //     strokeThickness: 4
  //   })
  //   this.label.x = -this.label.width / 2
  //   this.label.y = ClassicCardView.height / 2

  //   this.addChild(this.bg)
  //   this.addChild(this.label)
  // }
}

// const labelText = (data: EntityData) =>
//   `${data.type} (${Object.keys(data.children).length})`
