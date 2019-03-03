/**
 * Expects the current player to have at least `count` selected entities.
 * Function returns an actual `Condition`
 * @param count X
 */
export const hasAtLeastXEntitiesSelected = (count) => (state, event) => event.player.selectedEntitiesCount >= count;
//# sourceMappingURL=hasAtLeastXEntitiesSelected.js.map