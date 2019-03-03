import { Entity } from "./entity";
export declare class EntityMap<T> {
    [entityID: number]: T | any;
    add(entity: T): number;
    remove(idx: number): any;
    remove(idx: string): any;
    /**
     * Makes sure that every child is at its own
     * unique 'idx' value, starting with 0
     */
    updateOrder(): this;
    toArray(): T[];
    readonly length: number;
    static byName: (name: string) => (entity: Entity) => boolean;
    static byType: (type: string) => (entity: Entity) => boolean;
    static sortByIdx: (a: Entity, b: Entity) => number;
}
export declare const notifyNewIdx: (entity: any, idx: number) => void;
