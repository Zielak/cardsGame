"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logs_1 = require("../logs");
exports.matchesSuit = function (state, event) {
    var pileTop = state.entities.findByName("mainPile").top;
    var chosenCard = event.target;
    if (chosenCard.suit === pileTop.suit) {
        return true;
    }
    else {
        logs_1.logs.warn("matchesSuit", "pile.top \"" + pileTop.suit + "\" !== cards suit \"" + chosenCard.suit + "\"");
        return false;
    }
};
//# sourceMappingURL=matchesSuit.js.map