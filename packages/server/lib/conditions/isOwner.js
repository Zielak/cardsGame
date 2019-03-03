/**
 * Is the player an owner of interacted entity
 * @param state
 * @param event
 */
export const isOwner = (state, event) => {
    return event.target.owner === event.player;
};
//# sourceMappingURL=isOwner.js.map