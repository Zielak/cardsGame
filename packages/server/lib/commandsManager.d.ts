import { State } from "./state";
import { ICommand, ICommandFactory } from "./command";
import { ServerPlayerEvent } from "./player";
export declare class CommandsManager {
    history: ICommand[];
    orderExecution(cmdFactory: ICommandFactory, state: State, event?: ServerPlayerEvent): boolean;
}
