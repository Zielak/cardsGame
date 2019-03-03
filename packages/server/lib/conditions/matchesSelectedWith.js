import { logs } from "../logs";
import { sentenceCase } from "@cardsgame/utils";
export const matchesSelectedWith = (propName) => (state, event) => {
    const target = event.target;
    const selected = event.player.selectedEntities;
    const matches = selected.every(entity => {
        return entity[propName] === target[propName];
    });
    if (!matches) {
        logs.warn("matchesSelectedWith", `${sentenceCase(target.type)}'s "${target.name}" property "${propName}" doesn't match other selected entities:`, selected.map(el => `${el.name}.${propName}:${el[propName]}`));
    }
    return matches;
};
//# sourceMappingURL=matchesSelectedWith.js.map