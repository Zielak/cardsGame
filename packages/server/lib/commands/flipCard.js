"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logs_1 = require("../logs");
var FlipCard = /** @class */ (function () {
    function FlipCard(card) {
        this.card = card;
    }
    FlipCard.prototype.execute = function (state) {
        logs_1.logs.log("" + this.constructor.name, "executing");
        this.card.flip();
        state.logTreeState();
    };
    FlipCard.prototype.undo = function (state) {
        this.card.flip();
    };
    return FlipCard;
}());
exports.FlipCard = FlipCard;
//# sourceMappingURL=flipCard.js.map