"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logs_1 = require("../logs");
var propsMatch = function (propName, values) { return function (entity) {
    var result = values.some(function (value) { return entity[propName] === value; });
    if (!result) {
        logs_1.logs.warn("propsMatch " + propName, "entity[" + propName + "] doesn't match any accepted values:", values);
    }
    return result;
}; };
exports.matchRank = function (_ranks) {
    var ranks = Array.isArray(_ranks) ? _ranks : [_ranks];
    return function (_, event) {
        var selected = event.player.selectedEntities;
        return selected.every(propsMatch("rank", ranks));
    };
};
exports.default = {
    matchRank: exports.matchRank
};
//# sourceMappingURL=selectedEntities.js.map