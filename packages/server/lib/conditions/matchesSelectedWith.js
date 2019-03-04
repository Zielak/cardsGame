"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logs_1 = require("../logs");
var utils_1 = require("@cardsgame/utils");
exports.matchesSelectedWith = function (propName) { return function (state, event) {
    var target = event.target;
    var selected = event.player.selectedEntities;
    var matches = selected.every(function (entity) {
        return entity[propName] === target[propName];
    });
    if (!matches) {
        logs_1.logs.warn("matchesSelectedWith", utils_1.sentenceCase(target.type) + "'s \"" + target.name + "\" property \"" + propName + "\" doesn't match other selected entities:", selected.map(function (el) { return el.name + "." + propName + ":" + el[propName]; }));
    }
    return matches;
}; };
//# sourceMappingURL=matchesSelectedWith.js.map