import { Entity } from "../entity";
import { Container } from "./container";
/**
 * TODO: Should ensure that none of the cards in hand
 * are visible to other players
 */
export declare class Hand extends Container {
    type: string;
    restyleChild(child: Entity, idx: number, arr: any): {
        x: number;
        y: number;
        angle: number;
    };
}
