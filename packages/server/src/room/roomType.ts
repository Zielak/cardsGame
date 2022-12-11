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
  maxClients: number
  patchRate: number
}

export interface RoomDefinition<S extends State> extends ColyRoomDefinition {
  /**
   * Set of all possible actions players can take in this game
   */
  possibleActions: ActionDefinition<S>[]
  /**
   * Set of all possible actions a bot can take, with some guidance
   */
  botActivities: BotActionsSet<S>

  /**
   * Will be called right after the game room is created.
   * Create your game state here: `this.setState(new MyState())`.
   * Prepare your play area now.
   * @category Lifetime
   */
  onInitGame(this: Room<S>, options?: Record<string, any>): void
  /**
   * Override it to state your own conditions of whether the game can be started or not.
   * @category Lifetime
   */
  canGameStart(this: Room<S>): boolean
  /**
   * Will be called when clients agree to start the game.
   * `state.players` is already populated with all players.
   * After this function, the game will give turn to the first player.
   * @category Lifetime
   */
  onStartGame(this: Room<S>, state: State): void | Command[]
  /**
   * Invoked when each round starts.
   * @category Lifetime
   */
  onRoundStart(this: Room<S>): void | Command[]
  /**
   * Invoked when players turn starts
   * @category Lifetime
   */
  onPlayerTurnStarted(this: Room<S>, player: Player): void | Command[]
  /**
   * Invoked when players turn ends
   * @category Lifetime
   */
  onPlayerTurnEnded(this: Room<S>, player: Player): void | Command[]
  /**
   * Invoked when a round is near completion.
   * @category Lifetime
   */
  onRoundEnd(this: Room<S>): void | Command[]

  /**
   * All room's available integration tests hooks
   * @category Integration tests
   */
  integrationHooks: Record<string, IntegrationHooks<S>>
}
