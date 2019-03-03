var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { nosync } from "colyseus";
import { float } from "@cardsgame/utils";
import { Container } from "./container";
export class Pile extends Container {
    constructor(options) {
        super(options);
        this.type = "pile";
        this.hijacksInteractionTarget = true;
        this.cardsData = new Map();
        this.limits = Object.assign({}, {
            minAngle: -45,
            maxAngle: 45,
            minX: -10,
            minY: -10,
            maxX: 10,
            maxY: 10
        }, options.limits);
    }
    onChildAdded(child) {
        this.cardsData.set(child.id, cardsDataFactory(this.limits));
    }
    onChildRemoved(childID) {
        this.cardsData.delete(childID);
    }
    restyleChild(child, idx, children) {
        const { x, y, angle } = this.cardsData.get(child.id) || DEFAULT_CARDS_DATA;
        return {
            x,
            y,
            angle
        };
    }
}
__decorate([
    nosync
], Pile.prototype, "limits", void 0);
__decorate([
    nosync
], Pile.prototype, "cardsData", void 0);
const cardsDataFactory = (limits) => {
    return {
        x: float(limits.minX, limits.maxX),
        y: float(limits.minY, limits.maxY),
        angle: float(limits.minAngle, limits.maxAngle)
    };
};
const DEFAULT_CARDS_DATA = {
    x: 0,
    y: 0,
    angle: 0
};
//# sourceMappingURL=pile.js.map