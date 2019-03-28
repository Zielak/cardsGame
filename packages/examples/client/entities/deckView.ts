import { Graphics, Text } from "pixi.js"
import { ClassicCardView } from "./classicCardView"
import { ContainerView } from "./containerView"
import { ClientEntityData, EntityData } from "@cardsgame/client/src/types"

export class DeckView extends ContainerView {
  bg: Graphics
  label: Text

  constructor(data: ClientEntityData) {
    super(data)
    const PLUS_SIZE = 10
    this.bg = new Graphics()

    this.bg.beginFill(0x491008, 0.1)
    this.bg.lineStyle(3, 0xff754a, 1)
    this.bg.drawRoundedRect(
      -ClassicCardView.width / 2 - PLUS_SIZE,
      -ClassicCardView.height / 2 - PLUS_SIZE,
      ClassicCardView.width + PLUS_SIZE * 2,
      ClassicCardView.height + PLUS_SIZE * 2,
      8
    )
    this.label = new Text(labelText(this.data), {
      fill: ["#ffffff", "#00ff99"],
      stroke: "#4a1850",
      strokeThickness: 5
    })
    this.label.x = -this.label.width / 2
    this.label.y = ClassicCardView.height / 2

    this.addChild(this.bg)
    this.addChild(this.label)
  }
}

const labelText = (data: EntityData) =>
  `${data.type} (${Object.keys(data.children).length})`
