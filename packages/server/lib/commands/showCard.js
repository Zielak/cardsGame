"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logs_1 = require("../logs");
var ShowCard = /** @class */ (function () {
    function ShowCard(_cards) {
        this.cards = Array.isArray(_cards) ? _cards : [_cards];
    }
    ShowCard.prototype.execute = function (state) {
        logs_1.logs.log("" + this.constructor.name, "executing");
        this.cards.forEach(function (card) { return card.show(); });
        state.logTreeState();
    };
    ShowCard.prototype.undo = function (state) {
        this.cards.forEach(function (card) { return card.hide(); });
    };
    return ShowCard;
}());
exports.ShowCard = ShowCard;
//# sourceMappingURL=showCard.js.map