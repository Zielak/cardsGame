/// <reference types="@cardsgame/types" />
import { EventEmitter } from "eventemitter3";
import { Entity } from "./entity";
import { EntityMap } from "./entityMap";
export declare class State extends EventEmitter {
    tableWidth: number;
    tableHeight: number;
    entities: Entity;
    players: EntityMap<PlayerData>;
    currentPlayerIdx: number;
    readonly currentPlayer: PlayerData;
    readonly playersCount: number;
    gameVariants: any;
    isGameStarted: boolean;
    _lastID: number;
    _allEntities: Map<number, Entity>;
    constructor(options?: IStateOptions);
    setupListeners(): void;
    /**
     * FIXME: that should be client-side code...
     * Player playing the game needs to have his cards visible
     * at HIS pottom of the screen...
     */
    private updatePlayers;
    /**
     * Registers new entity to the gamestate
     * @param entity
     * @returns new ID to be assigned to that entity
     */
    rememberEntity(entity: Entity): number;
    /**
     * Get an Entity by its ID
     * @param id
     */
    getEntity(id: EntityID): Entity;
    /**
     * Get an Entity by its idx path
     * @param path
     */
    getEntity(path: number[]): Entity;
    /**
     * Gets an array of all entities from the top-most parent
     * to the lowest of the child.
     */
    getEntitiesAlongPath(path: number[]): Entity[];
    logTreeState(): void;
    static ROOT_ID: number;
}
export interface IStateOptions {
    minClients: number;
    maxClients: number;
    hostID: string;
}
export declare type PlayerData = {
    entity: Entity;
    clientID: string;
};
