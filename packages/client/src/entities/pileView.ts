import { Graphics, Text } from "pixi.js"
import { ClassicCardView } from "./classicCardView"
import { ContainerView } from "./containerView"
import { EntityData, ClientEntityData } from "../types"

export class PileView extends ContainerView {
  bg: Graphics
  label: Text

  constructor(data: ClientEntityData) {
    super(data)
    this.bg = new Graphics()
    const radius = Math.max(ClassicCardView.width, ClassicCardView.height) / 1.5

    this.bg.beginFill(0x491008, 0.1)
    this.bg.lineStyle(3, 0xff754a, 1)
    this.bg.drawCircle(0, 0, radius)

    this.label = new Text(labelText(this.data), {
      fill: ["#ffffff", "#00ff99"],
      stroke: "#4a1850",
      strokeThickness: 4
    })
    this.label.x = -this.label.width / 2
    this.label.y = ClassicCardView.height / 2

    this.addChild(this.bg)
    this.addChild(this.label)
  }
}

const labelText = (data: EntityData) =>
  `${data.type} (${Object.keys(data.children).length})`
