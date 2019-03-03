var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Card } from "./card";
import { logs } from "../logs";
import { condvis } from "../decorators";
export class ClassicCard extends Card {
    constructor(options) {
        super(options);
        this.type = "classicCard";
        this._visibilityData.add(["name", "suit", "rank"], 
        /* toEveryone */ () => this.faceUp, 
        /* toOwner */ () => {
            // Only if it's in his hand
            const parentContainer = this.parentEntity;
            return parentContainer.type === "hand";
        });
        this.suit = options.suit;
        this.rank = options.rank;
        this.name = this.rank + this.suit;
    }
}
__decorate([
    condvis
], ClassicCard.prototype, "name", void 0);
__decorate([
    condvis
], ClassicCard.prototype, "suit", void 0);
__decorate([
    condvis
], ClassicCard.prototype, "rank", void 0);
export const standardDeck = (ranks = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A"
], suits = ["H", "S", "C", "D"]) => {
    const cards = suits.reduce((prevS, suit) => [
        ...prevS,
        ...ranks.reduce((prevR, rank) => [...prevR, { suit, rank }], [])
    ], []);
    logs.verbose(`created a deck of ${cards.length} cards`);
    return cards;
};
//# sourceMappingURL=classicCard.js.map