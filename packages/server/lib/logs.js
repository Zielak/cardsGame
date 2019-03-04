"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var entity_1 = require("./entity");
var syntaxHighlight = function (arg) {
    if (typeof arg === "string") {
        return chalk_1.default.gray(arg);
    }
    if (typeof arg === "number") {
        return chalk_1.default.red.bold("" + arg);
    }
    if (typeof arg === "boolean") {
        return chalk_1.default.green.bold(arg.toString());
    }
    if (arg instanceof entity_1.Entity) {
        return chalk_1.default.yellow(exports.minifyEntity(arg));
    }
    return arg;
};
var verbose = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    console.log.apply(console, __spread(["\t"], args.map(function (arg) { return chalk_1.default.gray(arg); })));
};
var log = function (first) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (args.length > 0) {
        console.log.apply(console, __spread([first + ":"], args.map(syntaxHighlight)));
    }
    else {
        console.log.call(console, chalk_1.default.gray("\t" + first));
    }
};
var info = function (first) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    console.info.apply(console, __spread([
        chalk_1.default.bgBlue.black(" " + first + " ")
    ], args.map(syntaxHighlight)));
};
var warn = function (first) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    console.warn.apply(console, __spread([
        chalk_1.default.bgYellow.black(" " + first + " ")
    ], args.map(syntaxHighlight)));
};
var error = function (first) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    console.error.apply(console, __spread([
        chalk_1.default.bgRed(" " + first + " ")
    ], args.map(syntaxHighlight)));
};
exports.logs = {
    verbose: verbose,
    log: log,
    info: info,
    warn: warn,
    error: error
};
exports.minifyEntity = function (e) {
    return e.type + ":" + e.name;
};
// Testing logs
// log('--- Testing logs, ignore me ---')
// log('Simple log', 'one', 2, true)
// info('Info', 'one', 2, true)
// warn('Warn', 'one', 2, true)
// error('Error', 'one', 2, true)
// log('--- Testing logs finished ---')
//# sourceMappingURL=logs.js.map