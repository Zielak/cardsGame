import { logs } from "../logs";
export class HideCard {
    constructor(card) {
        this.card = card;
    }
    execute(state) {
        logs.log(`${this.constructor.name}`, "executing");
        this.card.hide();
        state.logTreeState();
    }
    undo(state) {
        this.card.show();
    }
}
//# sourceMappingURL=hideCard.js.map