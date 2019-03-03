export class CompositeCommand {
    constructor(commands) {
        this.commands = commands;
    }
    execute(state) {
        for (let i = 0; i < this.commands.length; i++) {
            this.commands[i].execute(state);
        }
    }
    undo(state) {
        for (let i = this.commands.length; i > 0; i--) {
            if (!this.commands[i].undo)
                return;
            this.commands[i].undo(state);
        }
    }
}
//# sourceMappingURL=compositeCommand.js.map