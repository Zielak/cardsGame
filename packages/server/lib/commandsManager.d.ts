import { State } from "state";
import { ICommand, ICommandFactory } from "command";
import { PlayerEvent } from "player";
export declare class CommandsManager {
    history: ICommand[];
    orderExecution(cmdFactory: ICommandFactory, state: State, event?: PlayerEvent): boolean;
}
