"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logs_1 = require("../logs");
var PreviousPlayer = /** @class */ (function () {
    function PreviousPlayer() {
    }
    PreviousPlayer.prototype.execute = function (state) {
        // TODO: move these logs outside...
        var _ = this.constructor.name;
        logs_1.logs.log(_, "executing");
        var current = state.currentPlayerIdx;
        var next = current - 1 === -1 ? state.playersCount - 1 : current - 1;
        state.currentPlayerIdx = next;
        logs_1.logs.log(_, "now it's " + state.currentPlayer + " player turn");
        // state.logTreeState()
    };
    return PreviousPlayer;
}());
exports.PreviousPlayer = PreviousPlayer;
//# sourceMappingURL=previousPlayer.js.map