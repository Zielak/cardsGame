import { logs } from "../logs";
const propsMatch = (propName, values) => (entity) => {
    const result = values.some(value => entity[propName] === value);
    if (!result) {
        logs.warn(`propsMatch ${propName}`, `entity[${propName}] doesn't match any accepted values:`, values);
    }
    return result;
};
export const matchRank = (_ranks) => {
    const ranks = Array.isArray(_ranks) ? _ranks : [_ranks];
    return (_, event) => {
        const selected = event.player.selectedEntities;
        return selected.every(propsMatch("rank", ranks));
    };
};
export default {
    matchRank
};
//# sourceMappingURL=selectedEntities.js.map