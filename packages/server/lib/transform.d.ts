import { EventEmitter } from "eventemitter3";
export declare class EntityTransform extends EventEmitter {
    private _x;
    private _y;
    private _angle;
    constructor(x?: number, y?: number, angle?: number);
    x: number;
    y: number;
    angle: number;
}
