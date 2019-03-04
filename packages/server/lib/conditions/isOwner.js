"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Is the player an owner of interacted entity
 * @param state
 * @param event
 */
exports.isOwner = function (state, event) {
    return event.target.owner === event.player;
};
//# sourceMappingURL=isOwner.js.map