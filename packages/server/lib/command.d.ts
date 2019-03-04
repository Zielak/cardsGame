import { State } from "./state";
import { ServerPlayerEvent } from "./player";
export interface ICommand {
    execute(state: State): any;
    undo?(state: State): any;
}
export declare type ICommandFactory = (state: State, event: ServerPlayerEvent) => ICommand | ICommand[];
