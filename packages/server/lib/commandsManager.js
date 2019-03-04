"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logs_1 = require("./logs");
var compositeCommand_1 = require("./commands/compositeCommand");
var CommandsManager = /** @class */ (function () {
    function CommandsManager() {
        this.history = [];
    }
    CommandsManager.prototype.orderExecution = function (cmdFactory, state, event) {
        var result = false;
        try {
            var cmd = cmdFactory(state, event);
            if (Array.isArray(cmd)) {
                cmd = new compositeCommand_1.CompositeCommand(cmd);
            }
            cmd.execute(state);
            this.history.push(cmd);
            result = true;
        }
        catch (e) {
            logs_1.logs.error("orderExecution", "command FAILED to execute", e);
        }
        return result;
    };
    return CommandsManager;
}());
exports.CommandsManager = CommandsManager;
//# sourceMappingURL=commandsManager.js.map