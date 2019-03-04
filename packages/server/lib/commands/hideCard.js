"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logs_1 = require("../logs");
var HideCard = /** @class */ (function () {
    function HideCard(card) {
        this.card = card;
    }
    HideCard.prototype.execute = function (state) {
        logs_1.logs.log("" + this.constructor.name, "executing");
        this.card.hide();
        state.logTreeState();
    };
    HideCard.prototype.undo = function (state) {
        this.card.show();
    };
    return HideCard;
}());
exports.HideCard = HideCard;
//# sourceMappingURL=hideCard.js.map