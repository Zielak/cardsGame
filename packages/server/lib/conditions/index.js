export * from "./isPlayersTurn";
export * from "./matchesRank";
export * from "./matchesSuit";
export * from "./targetsNameIs";
export * from "./isOwner";
export * from "./isSelected";
export * from "./hasAtLeastXEntitiesSelected";
export * from "./matchesSelectedWith";
export { default as selectedEntities } from "./selectedEntities";
export const OR = (...conditions) => {
    return (state, event) => {
        return conditions.some(cond => cond(state, event));
    };
};
export const AND = (...conditions) => {
    return (state, event) => {
        return conditions.every(cond => cond(state, event));
    };
};
export const NOT = (...conditions) => {
    return (state, event) => {
        return !conditions.every(cond => cond(state, event));
    };
};
//# sourceMappingURL=index.js.map