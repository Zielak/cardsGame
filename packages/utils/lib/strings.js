"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trim = function (string, maxLength) {
    if (string === void 0) { string = ""; }
    if (maxLength === void 0) { maxLength = 7; }
    if (typeof string !== "string")
        return;
    return string.length <= maxLength
        ? string
        : string.substr(0, maxLength - 1) + "…";
};
exports.randomName = function () {
    var randomLetter = function () { return String.fromCharCode(Math.random() * (90 - 65) + 65); };
    return randomLetter() + randomLetter() + randomLetter();
};
exports.camelCase = function (str) {
    return str
        .replace(/\s(.)/g, function ($1) { return $1.toUpperCase(); })
        .replace(/\s/g, "")
        .replace(/^(.)/, function ($1) { return $1.toLowerCase(); });
};
exports.sentenceCase = function (str) {
    return str
        .replace(/\s(.)/g, function ($1) { return $1.toUpperCase(); })
        .replace(/^(.)/, function ($1) { return $1.toUpperCase(); });
};
//# sourceMappingURL=strings.js.map