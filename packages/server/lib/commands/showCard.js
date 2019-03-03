import { logs } from "../logs";
export class ShowCard {
    constructor(_cards) {
        this.cards = Array.isArray(_cards) ? _cards : [_cards];
    }
    execute(state) {
        logs.log(`${this.constructor.name}`, "executing");
        this.cards.forEach(card => card.show());
        state.logTreeState();
    }
    undo(state) {
        this.cards.forEach(card => card.hide());
    }
}
//# sourceMappingURL=showCard.js.map