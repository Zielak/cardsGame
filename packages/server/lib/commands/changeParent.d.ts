import { Entity } from "../entity";
import { State } from "../state";
import { ICommand } from "../command";
export declare class ChangeParent implements ICommand {
    private entities;
    private source;
    private target;
    constructor(entity: Entity, source: Entity, target: Entity);
    constructor(entities: Entity[], source: Entity, target: Entity);
    execute(state: State): void;
    undo(state: State): void;
}
