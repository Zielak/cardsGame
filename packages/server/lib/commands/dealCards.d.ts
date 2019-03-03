import { State } from "../state";
import { Entity } from "../entity";
import { ICommand } from "command";
export declare class DealCards implements ICommand {
    private source;
    private count;
    targets: Entity[];
    /**
     * Deals `count` cards from this container to other containers.
     * Eg. hands
     *
     * @param source will take cards from here
     * @param target and put them in these entities
     * @param count how many cards should I deal for each target?
     */
    constructor(source: Entity, targets: Entity | Entity[], count?: number);
    execute(state: State): void;
}
