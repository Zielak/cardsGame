"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.float = function (min, max) {
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = 1; }
    return Math.floor(Math.random() * (max - min + 1) + min);
};
exports.limit = function (val, min, max) {
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = 1; }
    return val < min ? min : val > max ? max : val;
};
exports.wrap = function (val, max) {
    if (max === void 0) { max = 1; }
    return ((val % max) + max) % max;
};
exports.rad2deg = function (angle) {
    //  discuss at: http://locutus.io/php/rad2deg/
    // original by: Enrique Gonzalez
    // improved by: Brett Zamir (http://brett-zamir.me)
    //   example 1: rad2deg(3.141592653589793)
    //   returns 1: 180
    return angle * 57.29577951308232; // angle / Math.PI * 180
};
exports.deg2rad = function (angle) {
    //  discuss at: http://locutus.io/php/deg2rad/
    // original by: Enrique Gonzalez
    // improved by: Thomas Grainger (http://graingert.co.uk)
    //   example 1: deg2rad(45)
    //   returns 1: 0.7853981633974483
    return angle * 0.017453292519943295; // (angle / 180) * Math.PI;
};
exports.cm2px = function (value) { return value * 11.5; };
exports.px2cm = function (value) { return value / 11.5; };
//# sourceMappingURL=numbers.js.map