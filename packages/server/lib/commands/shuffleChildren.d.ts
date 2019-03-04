import { Entity } from "../entity";
import { State } from "../state";
import { ICommand } from "../command";
export declare class ShuffleChildren implements ICommand {
    private container;
    constructor(container: Entity);
    execute(state: State): void;
}
