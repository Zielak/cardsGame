import { logs } from "logs";
import { CompositeCommand } from "commands/compositeCommand";
export class CommandsManager {
    constructor() {
        this.history = [];
    }
    orderExecution(cmdFactory, state, event) {
        let result = false;
        try {
            let cmd = cmdFactory(state, event);
            if (Array.isArray(cmd)) {
                cmd = new CompositeCommand(cmd);
            }
            cmd.execute(state);
            this.history.push(cmd);
            result = true;
        }
        catch (e) {
            logs.error("orderExecution", `command FAILED to execute`, e);
        }
        return result;
    }
}
//# sourceMappingURL=commandsManager.js.map