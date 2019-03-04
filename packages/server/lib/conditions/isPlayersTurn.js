"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logs_1 = require("../logs");
/**
 * Checks state to confirm that it's interacting player's turn now.
 * @param state
 * @param event
 */
exports.isPlayersTurn = function (state, event) {
    if (state.currentPlayer.clientID === event.player.clientID) {
        return true;
    }
    logs_1.logs.warn("isPlayersTurn", "It's not players " + event.player.clientID + " turn. State says: " + state.currentPlayerIdx);
    return false;
};
//# sourceMappingURL=isPlayersTurn.js.map