"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./isPlayersTurn"));
__export(require("./matchesRank"));
__export(require("./matchesSuit"));
__export(require("./targetsNameIs"));
__export(require("./isOwner"));
__export(require("./isSelected"));
__export(require("./hasAtLeastXEntitiesSelected"));
__export(require("./matchesSelectedWith"));
var selectedEntities_1 = require("./selectedEntities");
exports.selectedEntities = selectedEntities_1.default;
exports.OR = function () {
    var conditions = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        conditions[_i] = arguments[_i];
    }
    return function (state, event) {
        return conditions.some(function (cond) { return cond(state, event); });
    };
};
exports.AND = function () {
    var conditions = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        conditions[_i] = arguments[_i];
    }
    return function (state, event) {
        return conditions.every(function (cond) { return cond(state, event); });
    };
};
exports.NOT = function () {
    var conditions = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        conditions[_i] = arguments[_i];
    }
    return function (state, event) {
        return !conditions.every(function (cond) { return cond(state, event); });
    };
};
//# sourceMappingURL=index.js.map