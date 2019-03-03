import { logs } from "../logs";
export class FlipCard {
    constructor(card) {
        this.card = card;
    }
    execute(state) {
        logs.log(`${this.constructor.name}`, "executing");
        this.card.flip();
        state.logTreeState();
    }
    undo(state) {
        this.card.flip();
    }
}
//# sourceMappingURL=flipCard.js.map