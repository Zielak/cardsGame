"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.def = function (value, def) {
    return typeof value !== "undefined" ? value : def;
};
exports.noop = function () { };
exports.times = function (length, func) {
    return Array.from({ length: length }, func);
};
//# sourceMappingURL=utils.js.map