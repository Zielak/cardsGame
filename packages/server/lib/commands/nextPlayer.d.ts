import { State } from "../state";
import { ICommand } from "../command";
export declare class NextPlayer implements ICommand {
    execute(state: State): void;
}
