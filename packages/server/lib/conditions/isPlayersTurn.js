import { logs } from "../logs";
/**
 * Checks state to confirm that it's interacting player's turn now.
 * @param state
 * @param event
 */
export const isPlayersTurn = (state, event) => {
    if (state.currentPlayer.clientID === event.player.clientID) {
        return true;
    }
    logs.warn("isPlayersTurn", `It's not players ${event.player.clientID} turn. State says: ${state.currentPlayerIdx}`);
    return false;
};
//# sourceMappingURL=isPlayersTurn.js.map