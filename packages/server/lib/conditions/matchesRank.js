import { logs } from "../logs";
export const matchesRank = (state, event) => {
    const pileTop = state.entities.findByName("mainPile").top;
    const chosenCard = event.target;
    if (chosenCard.rank === pileTop.rank) {
        return true;
    }
    logs.warn("matchesRank", `pile.top "${pileTop.rank}" !== cards rank "${chosenCard.rank}"`);
    return false;
};
//# sourceMappingURL=matchesRank.js.map