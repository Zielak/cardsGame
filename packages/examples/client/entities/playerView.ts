import { Sprite, Text } from "pixi.js"
import { ClassicCardView } from "./classicCardView"
import { EntityView } from "./entityView"
import {
  ClientEntityData,
  AttributeChangeData
} from "@cardsgame/client/src/types"

export class PlayerView extends EntityView {
  icon: Sprite
  label: Text

  constructor(data: ClientEntityData) {
    super(data)
    this.icon = new Sprite()
    this.label = new Text(this.data.name, {
      align: "center",
      fill: ["#ffffff", "#00ff99"],
      stroke: "#4a1850",
      strokeThickness: 5
    })
    this.label.x = -this.label.width / 2
    this.label.y = -ClassicCardView.height / 2 - this.label.height

    this.addChild(this.icon)
    this.addChild(this.label)

    this.on("attributeChanged", (change: AttributeChangeData) => {
      switch (change.name) {
        case "name":
          this.label.text = change.value
          break
      }
    })
  }
}
