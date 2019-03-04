"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Target entity is selected in the eyes of the interacting player.
 * @param state
 * @param event
 */
exports.isSelected = function (state, event) {
    return event.player.isEntitySelected(event.target);
};
//# sourceMappingURL=isSelected.js.map