"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var colyseus_1 = require("colyseus");
exports.Server = colyseus_1.Server;
__export(require("./entities"));
var commands = __importStar(require("./commands"));
exports.commands = commands;
var conditions = __importStar(require("./conditions"));
exports.conditions = conditions;
__export(require("./transform"));
__export(require("./entity"));
__export(require("./entityMap"));
__export(require("./player"));
__export(require("./room"));
__export(require("./state"));
__export(require("./logs"));
//# sourceMappingURL=index.js.map