export declare class VisibilityData {
    private data;
    add(keys: string[] | string, toEveryone: () => boolean, toOwner: () => boolean): void;
    shouldSendToEveryone(key: string): boolean;
    shouldSendToOwner(key: string): boolean;
    readonly keys: string[];
}
