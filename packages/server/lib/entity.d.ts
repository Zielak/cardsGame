/// <reference types="@cardsgame/types" />
import { EventEmitter } from "eventemitter3";
import { EntityTransformData } from "@cardsgame/utils";
import { EntityMap } from "./entityMap";
import { State } from "./state";
import { Player } from "./player";
import { EntityTransform } from "./transform";
import { VisibilityData } from "./visibilityData";
export declare class Entity extends EventEmitter {
    _visibilityData: VisibilityData;
    _state: State;
    id: EntityID;
    idx: number;
    children: EntityMap<Entity>;
    parent: EntityID;
    hijacksInteractionTarget: boolean;
    visibleToPublic: boolean;
    isContainer: boolean;
    type: string;
    name: string;
    selected: boolean;
    width: number;
    height: number;
    x: number;
    y: number;
    angle: number;
    _localTransform: EntityTransform;
    _worldTransform: EntityTransform;
    constructor(options: IEntityOptions);
    protected setupListeners(): void;
    /**
     * Send out all private attributes, depending on their "privacy state"
     *
     * @param {string} [client] - if defined, will send private stuff only to this client if he owns this element (prevents too much updates)
     */
    sendAllPrivateAttributes(client?: string): void;
    _sendPrivAttrUpdate(key: string, _public: boolean): void;
    addChild(child: Entity): void;
    addChildren(children: Entity[]): void;
    addChildAt(newChild: Entity, idx: number): void;
    removeChild(id: EntityID, _silent?: boolean): boolean;
    removeChildAt(idx: number, _silent?: boolean): boolean;
    onChildAdded(child: Entity): void;
    onChildRemoved(childID: EntityID): void;
    restyleChildren(): void;
    /**
     * Override in each container-like entity
     */
    restyleChild(child: Entity, idx: number, children: Entity[]): EntityTransformData;
    updateTransform(): void;
    resetWorldTransform(): void;
    filterByName(name: string): Entity[];
    findByName(name: string): Entity;
    filterByType(type: string): Entity[];
    findByType(type: string): Entity;
    /**
     * Get the element with highest 'idx' value
     */
    readonly top: Entity;
    /**
     * Get the element with the lowest 'idx' value
     */
    readonly bottom: Entity;
    /**
     * Number of child elements
     */
    readonly length: number;
    /**
     * Points out if this element can be
     * target of any interaction
     */
    readonly interactive: boolean;
    /**
     * Gets all children in array form, "sorted" by idx
     */
    readonly childrenArray: Entity[];
    /**
     * Gets a reference to this entity's parent.
     * There must be any parent, so any null will fallback to state's `entities`
     */
    readonly parentEntity: Entity;
    /**
     * Get the real owner of this container, by traversing `this.parent` chain.
     *
     * @returns `Player` or `null` if this container doesn't belong to anyone
     */
    readonly owner: Player;
    readonly idxPath: number[];
    static DEFAULT_NAME: string;
    static DEFAULT_TYPE: string;
}
export interface IEntityOptions {
    state: State;
    type?: string;
    name?: string;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    angle?: number;
    parent?: EntityID | Entity;
    idx?: number;
}
export declare type EParentUpdate = {
    entity: Entity;
    lastParent: Entity;
};
export declare type EOwnerUpdate = {
    previousOwner: string;
    currentOwner: string;
    entity: Entity;
};
