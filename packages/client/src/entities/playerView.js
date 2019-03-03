import { Sprite, Text } from "pixi.js";
import { ClassicCardView } from "./classicCardView";
import { EntityView } from "./entityView";
export class PlayerView extends EntityView {
    constructor(data) {
        super(data);
        this.icon = new Sprite();
        this.label = new Text(this.data.name, {
            align: "center",
            fill: ["#ffffff", "#00ff99"],
            stroke: "#4a1850",
            strokeThickness: 5
        });
        this.label.x = -this.label.width / 2;
        this.label.y = -ClassicCardView.height / 2 - this.label.height;
        this.addChild(this.icon);
        this.addChild(this.label);
        this.on("attributeChanged", (change) => {
            switch (change.name) {
                case "name":
                    this.label.text = change.value;
                    break;
            }
        });
    }
}
//# sourceMappingURL=playerView.js.map