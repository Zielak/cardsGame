import type { ActionDefinition } from "../actions/types.js"
import type { BotActionsSet } from "../bots/botNeuron.js"
import type { Command } from "../command.js"
import type { IntegrationHooks } from "../integration.js"
import type { Player } from "../player/index.js"
import type { State } from "../state/state.js"

import type { Room } from "./base.js"

/**
 * Extracted from colyseus room, and suggesting.
 * These propr make sense to be public
 */
interface ColyRoomDefinition {
  maxClients?: number
  patchRate?: number
}

/**
 * @category Room
 */
export interface RoomDefinition<S extends State> extends ColyRoomDefinition {
  /**
   * Reference to your game's `State` class. Will use just basic `State` by default
   */
  stateConstructor?: new (...args: any[]) => S

  /**
   * The base
   */
  variantDefaults?: S["variantData"]

  /**
   * Set of all possible actions players can take in this game
   */
  possibleActions?: ActionDefinition<S>[]

  /**
   * Set of all possible actions a bot can take, with some guidance
   */
  botActivities?: BotActionsSet<S>

  /**
   * Will be called right after the game room is created, and game state is setup.
   * @category Lifecycle
   */
  onInitGame?(this: Room<S>, options?: RoomCreateOptions): void
  /**
   * State your own conditions of whether the game can be started or not.
   * @category Lifecycle
   */
  canGameStart?(this: Room<S>): boolean
  /**
   * Will be called when clients agree to start the game.
   * `state.players` is already populated with all players.
   * After this function, the game will give turn to the first player.
   * @category Lifecycle
   */
  onStartGame?(this: Room<S>): void | Command[]
  /**
   * Invoked when each round starts.
   * @category Lifecycle
   */
  onRoundStart?(this: Room<S>): void | Command[]
  /**
   * Invoked when players turn starts
   * @category Lifecycle
   */
  onPlayerTurnStarted?(this: Room<S>, player: Player): void | Command[]
  /**
   * Invoked when players turn ends
   * @category Lifecycle
   */
  onPlayerTurnEnded?(this: Room<S>, player: Player): void | Command[]
  /**
   * Invoked when a round is near completion.
   * @category Lifecycle
   */
  onRoundEnd?(this: Room<S>): void | Command[]

  /**
   * All room's available integration tests hooks
   * @category Integration tests
   */
  integrationHooks?: Record<string, IntegrationHooks<S>>
}
