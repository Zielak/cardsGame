"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logs_1 = require("../logs");
var StartGame = /** @class */ (function () {
    function StartGame() {
    }
    StartGame.prototype.execute = function (state) {
        var _ = this.constructor.name;
        logs_1.logs.log(_, "executing");
        state.isGameStarted = true;
        state.currentPlayerIdx = 0;
        logs_1.logs.log(_, state.playersCount + " players");
        logs_1.logs.log(_, "Current player is", state.currentPlayer);
        state.logTreeState();
    };
    return StartGame;
}());
exports.StartGame = StartGame;
//# sourceMappingURL=startGame.js.map