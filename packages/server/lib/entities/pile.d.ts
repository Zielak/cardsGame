/// <reference types="@cardsgame/types" />
import { Entity, IEntityOptions } from "../entity";
import { Container } from "./container";
export declare class Pile extends Container {
    type: string;
    hijacksInteractionTarget: boolean;
    limits: PileVisualLimits;
    cardsData: Map<number, CardsData>;
    constructor(options: IPileOptions);
    onChildAdded(child: Entity): void;
    onChildRemoved(childID: EntityID): void;
    restyleChild(child: Entity, idx: number, children: Entity[]): {
        x: number;
        y: number;
        angle: number;
    };
}
export interface IPileOptions extends IEntityOptions {
    limits?: PileVisualLimits;
}
interface CardsData {
    angle: number;
    x: number;
    y: number;
}
interface PileVisualLimits {
    minAngle: number;
    maxAngle: number;
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}
export {};
