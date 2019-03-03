import { Card, ICardOptions } from "./card";
export interface IClassicCardOptions extends ICardOptions {
    suit: string;
    rank: string;
}
export declare class ClassicCard extends Card {
    type: string;
    name: string;
    suit: string;
    rank: string;
    constructor(options: IClassicCardOptions);
}
export declare const standardDeck: (ranks?: string[], suits?: string[]) => IClassicCardOptions[];
