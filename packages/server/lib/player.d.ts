import { Entity, IEntityOptions } from "./entity";
export declare class Player extends Entity {
    type: string;
    clientID: string;
    score: number;
    timeLeft: number;
    _selectedEntities: Set<Entity>;
    selectedEntitiesCount: number;
    constructor(options: IPlayerOptions);
    /**
     * Will make this element selected in
     * the eyes of this player. This knowledge
     * is not shared with others by default.
     * @param entity
     */
    selectEntity(entity: Entity): void;
    deselectEntity(entity: Entity): void;
    clearSelection(): Entity[];
    isEntitySelected(entity: Entity): boolean;
    readonly selectedEntities: Entity[];
}
export interface IPlayerOptions extends IEntityOptions {
    clientID: string;
}
export declare type ServerPlayerEvent = {
    player?: Player;
    type: string;
    target?: Entity;
    targetPath?: number[];
    targets?: Entity[];
    data?: any;
};
