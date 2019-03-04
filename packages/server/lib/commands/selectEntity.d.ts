import { Player } from "../player";
import { State } from "../state";
import { Entity } from "../entity";
import { ICommand } from "../command";
export declare class SelectEntity implements ICommand {
    private player;
    private entity;
    private selected;
    constructor(player: Player, entity: Entity, selected: boolean);
    execute(state: State): void;
    undo(): void;
}
