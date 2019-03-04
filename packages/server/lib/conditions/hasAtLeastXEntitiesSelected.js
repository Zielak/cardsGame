"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Expects the current player to have at least `count` selected entities.
 * Function returns an actual `Condition`
 * @param count X
 */
exports.hasAtLeastXEntitiesSelected = function (count) { return function (state, event) { return event.player.selectedEntitiesCount >= count; }; };
//# sourceMappingURL=hasAtLeastXEntitiesSelected.js.map