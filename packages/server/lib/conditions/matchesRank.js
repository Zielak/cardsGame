"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logs_1 = require("../logs");
exports.matchesRank = function (state, event) {
    var pileTop = state.entities.findByName("mainPile").top;
    var chosenCard = event.target;
    if (chosenCard.rank === pileTop.rank) {
        return true;
    }
    logs_1.logs.warn("matchesRank", "pile.top \"" + pileTop.rank + "\" !== cards rank \"" + chosenCard.rank + "\"");
    return false;
};
//# sourceMappingURL=matchesRank.js.map