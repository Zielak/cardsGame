import { State } from "../state";
import { Card } from "../entities/card";
import { ICommand } from "command";
export declare class FlipCard implements ICommand {
    private card;
    constructor(card: Card);
    execute(state: State): void;
    undo(state: State): void;
}
