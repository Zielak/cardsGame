import { Entity } from "./entity";
export declare const logs: {
    verbose: (...args: any[]) => void;
    log: (first: any, ...args: any[]) => void;
    info: (first: any, ...args: any[]) => void;
    warn: (first: any, ...args: any[]) => void;
    error: (first: any, ...args: any[]) => void;
};
export declare const minifyEntity: (e: Entity) => string;
