"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CompositeCommand = /** @class */ (function () {
    function CompositeCommand(commands) {
        this.commands = commands;
    }
    CompositeCommand.prototype.execute = function (state) {
        for (var i = 0; i < this.commands.length; i++) {
            this.commands[i].execute(state);
        }
    };
    CompositeCommand.prototype.undo = function (state) {
        for (var i = this.commands.length; i > 0; i--) {
            if (!this.commands[i].undo)
                return;
            this.commands[i].undo(state);
        }
    };
    return CompositeCommand;
}());
exports.CompositeCommand = CompositeCommand;
//# sourceMappingURL=compositeCommand.js.map