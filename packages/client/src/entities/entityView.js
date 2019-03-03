import { Container } from "pixi.js";
import { deg2rad } from "../../shared/numbers";
import { EntityEvents } from "../../shared/events";
export class EntityView extends Container {
    constructor(data) {
        super();
        this.data = data;
        this.isContainer = false;
        this.disablesTargetingChildren = false;
        this.on("attributeChanged", (change) => {
            if (change.name === "selected" && change.value === undefined) {
                // Don't remember "unknown" selected state, and don't act on it.
                return;
            }
            else {
                this.data[change.name] = change.value;
            }
            switch (change.name) {
                case "x":
                    this.x = parseFloat(change.value);
                    break;
                case "y":
                    this.y = parseFloat(change.value);
                    break;
                case "angle":
                    this.rotation = deg2rad(parseFloat(change.value));
                    break;
            }
        });
        this.on(EntityEvents.childAdded, (change) => {
            this.data.children[change.path.idx] = change.value;
        });
        this.on(EntityEvents.childRemoved, (change) => {
            delete this.data.children[change.path.idx];
        });
    }
    /**
     * Overrides PIXI's property to set its `interactive` dynamically
     * depending on type of parent container (if any)
     * for example: you can't click a card in the middle of Pile or Deck.
     * // TODO: this kind of "redirection of interaction target" should
     * // probably happen on server-side. Player should be direected to interact
     * // with top-item if he clicks either PILE itself or any CARD in the middle
     */
    get interactive() {
        // const parent = (this.parent as unknown) as EntityView
        // if (!parent.isContainer) {
        // 	return true
        // } else if (!parent.disablesTargetingChildren) {
        // 	return true
        // } else if (this.idx === Object.keys(parent.data.children).length - 1) {
        // 	// If its the top element in container
        // 	return true
        // }
        return true;
    }
    get id() {
        return this.data.id;
    }
    get idx() {
        return this.data.idx;
    }
    get idxPath() {
        const path = [this.idx];
        const getNext = (object) => {
            const parentsIdx = object.parent.idx;
            if (object.parent instanceof EntityView &&
                typeof parentsIdx === "number") {
                path.unshift(parentsIdx);
                getNext(object.parent);
            }
        };
        getNext(this);
        return path;
    }
}
//# sourceMappingURL=entityView.js.map