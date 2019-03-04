import { State } from "../state";
import { Card } from "../entities/card";
import { ICommand } from "../command";
export declare class ShowCard implements ICommand {
    cards: Card[];
    constructor(card: Card);
    constructor(cards: Card[]);
    execute(state: State): void;
    undo(state: State): void;
}
