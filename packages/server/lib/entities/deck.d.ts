import { Entity } from "../entity";
import { Container } from "./container";
export declare class Deck extends Container {
    type: string;
    hijacksInteractionTarget: boolean;
    restyleChild(child: Entity, idx: number, children: Entity[]): {
        x: number;
        y: number;
        angle: number;
    };
}
