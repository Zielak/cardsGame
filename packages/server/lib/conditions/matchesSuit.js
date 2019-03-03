import { logs } from "../logs";
export const matchesSuit = (state, event) => {
    const pileTop = state.entities.findByName("mainPile").top;
    const chosenCard = event.target;
    if (chosenCard.suit === pileTop.suit) {
        return true;
    }
    else {
        logs.warn("matchesSuit", `pile.top "${pileTop.suit}" !== cards suit "${chosenCard.suit}"`);
        return false;
    }
};
//# sourceMappingURL=matchesSuit.js.map