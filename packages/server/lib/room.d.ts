import * as colyseus from "colyseus";
import { CommandsManager } from "./commandsManager";
import { State } from "./state";
import { Entity } from "./entity";
import { ServerPlayerEvent } from "./player";
import { ICondition } from "./condition";
import { ICommandFactory } from "./command";
export declare class Room<S extends State> extends colyseus.Room<S> {
    name: string;
    commandsManager: CommandsManager;
    possibleActions: ActionsSet;
    onInit(options: any): void;
    /**
     * Start listening for private prop changes of any existing entity
     */
    setupPrivatePropsSync(): void;
    addPlayer(clientID: string): void;
    removePlayer(clientID: string): void;
    requestJoin(options: any, isRoomNew?: boolean): boolean | number;
    onJoin(client: colyseus.Client): void;
    onLeave(client: colyseus.Client, consented: boolean): void;
    onMessage(client: colyseus.Client, event: ServerPlayerEvent): void;
    /**
     * Check conditions and perform given action
     */
    performAction(client: colyseus.Client, event: ServerPlayerEvent): void;
    /**
     * Gets you a list of all possible game actions
     * that match with player's interaction
     */
    getActionsByInteraction(event: ServerPlayerEvent): ActionTemplate[];
    /**
     * Checks all attatched conditions (if any) to see if this action is legal
     */
    isLegal(conditions: ICondition[], event: ServerPlayerEvent): boolean;
    /**
     * Will be called right after the game room is created.
     * Prepare your play area now.
     * @param state
     */
    onSetupGame(state: State): void;
    /**
     * Will be called when players agree to start the game.
     * Now is the time to for example deal cards to all players.
     * @param state
     */
    onStartGame(state: State): void;
    onPlayerAdded(clientID: string, entity: Entity): void;
    onPlayerRemoved(clientID: string): void;
}
export declare type InteractionDefinition = {
    eventType?: string;
    name?: string | string[];
    type?: string | string[];
    value?: number | number[];
    rank?: string | string[];
    suit?: string | string[];
};
export declare type ActionsSet = Set<ActionTemplate>;
export declare type ActionTemplate = {
    name: string;
    interaction?: InteractionDefinition | InteractionDefinition[];
    conditions?: ICondition[];
    commandFactory: ICommandFactory;
};
