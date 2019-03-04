"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logs_1 = require("../logs");
var NextPlayer = /** @class */ (function () {
    function NextPlayer() {
    }
    NextPlayer.prototype.execute = function (state) {
        var _ = this.constructor.name;
        logs_1.logs.log(_, "executing");
        var current = state.currentPlayerIdx;
        var next = current + 1 === state.playersCount ? 0 : current + 1;
        state.currentPlayerIdx = next;
        logs_1.logs.log(_, "now it's " + state.currentPlayer + " player turn");
        // state.logTreeState()
    };
    return NextPlayer;
}());
exports.NextPlayer = NextPlayer;
//# sourceMappingURL=nextPlayer.js.map