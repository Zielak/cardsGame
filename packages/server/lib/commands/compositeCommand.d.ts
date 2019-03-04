import { State } from "../state";
import { ICommand } from "../command";
export declare class CompositeCommand implements ICommand {
    private commands;
    constructor(commands: ICommand[]);
    execute(state: State): void;
    undo(state: State): void;
}
