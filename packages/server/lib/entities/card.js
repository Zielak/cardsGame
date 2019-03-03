var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Entity } from "../entity";
import { def } from "@cardsgame/utils";
import { nosync } from "../decorators";
export class Card extends Entity {
    constructor(options) {
        super(options);
        this.type = "card";
        this.faceUp = def(options.faceUp, false);
        this.rotated = def(options.rotated, 0);
        this.marked = def(options.marked, false);
        this.visibleToPublic = this.faceUp;
    }
    flip() {
        this.faceUp = !this.faceUp;
        this.updateVisibleToPublic();
    }
    show() {
        this.faceUp = true;
        this.updateVisibleToPublic();
    }
    hide() {
        this.faceUp = false;
        this.updateVisibleToPublic();
    }
    updateVisibleToPublic() {
        this.visibleToPublic = this.faceUp;
        this.sendAllPrivateAttributes();
    }
}
__decorate([
    nosync
], Card.prototype, "id", void 0);
//# sourceMappingURL=card.js.map