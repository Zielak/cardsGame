/// <reference types="@cardsgame/types" />
import { Entity, IEntityOptions } from "../entity";
export declare class Card extends Entity {
    id: EntityID;
    type: string;
    faceUp: boolean;
    rotated: number;
    marked: boolean;
    constructor(options: ICardOptions);
    flip(): void;
    show(): void;
    hide(): void;
    updateVisibleToPublic(): void;
}
export interface ICardOptions extends IEntityOptions {
    faceUp?: boolean;
    rotated?: number;
    marked?: boolean;
}
