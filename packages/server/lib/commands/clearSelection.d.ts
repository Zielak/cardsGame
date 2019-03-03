import { Player } from "../player";
import { State } from "../state";
import { Entity } from "../entity";
import { ICommand } from "command";
export declare class ClearSelection implements ICommand {
    private player;
    deselected: Entity[];
    constructor(player: Player);
    execute(state: State): void;
    undo(): void;
}
