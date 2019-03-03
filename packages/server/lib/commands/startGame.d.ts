import { State } from "../state";
import { ICommand } from "command";
export declare class StartGame implements ICommand {
    execute(state: State): void;
}
