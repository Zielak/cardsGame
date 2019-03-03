import { State } from "../state";
import { ICommand } from "command";
export declare class PreviousPlayer implements ICommand {
    execute(state: State): void;
}
