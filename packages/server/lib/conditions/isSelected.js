/**
 * Target entity is selected in the eyes of the interacting player.
 * @param state
 * @param event
 */
export const isSelected = (state, event) => {
    return event.player.isEntitySelected(event.target);
};
//# sourceMappingURL=isSelected.js.map