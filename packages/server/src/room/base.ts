import deepMerge from "@bundled-es-modules/deepmerge"
import { type Client, type ISendOptions, Room as colRoom } from "@colyseus/core"
import type { IBroadcastOptions } from "@colyseus/core/build/Room.js"

import type { ActionDefinition } from "@/actions/types.js"
import type { BotActionsSet } from "@/bots/botNeuron.js"
import { BotRunner } from "@/bots/runner.js"
import { fallback } from "@/messages/fallback.js"
import { messages } from "@/messages/messageHandler.js"
import { BotOptions } from "@/player/bot.js"
import { Player, ServerPlayerMessage, Bot } from "@/player/index.js"
import { GameClient } from "@/state/client.js"
import { State } from "@/state/state.js"

import type { Command } from "../command.js"
import { CommandsManager } from "../commandsManager/commandsManager.js"
import type {
  IntegrationHookNames,
  IntegrationHooks,
  IntegrationHookCallbackContext,
  IntegrationHookData,
} from "../integration.js"
import { logs } from "../logs.js"

import type { RoomDefinition } from "./roomType.js"
import { debugRoomMessage } from "./utils/debugRoomMessage.js"

type BroadcastOptions = IBroadcastOptions & {
  undo: boolean
}
type ClientSendOptions = ISendOptions & {
  undo: boolean
}

/**
 * @ignore
 */
export abstract class Room<
    S extends State,
    MoreMessageTypes extends Record<string, unknown> = Record<string, unknown>,
  >
  extends colRoom<S>
  implements RoomDefinition<S>
{
  patchRate = 100 // ms = 10FPS

  commandsManager: CommandsManager<S>

  /**
   * Reference to your game's `State` class.
   */
  stateConstructor: new () => S

  playersCount?: PlayersCount

  variantsConfig?: VariantsConfig<S["variantData"]>

  /**
   * May be undefined if the game doesn't include any
   * bot-related configuration
   */
  botRunner?: BotRunner<S>

  /**
   * Set of all possible actions players can take in this game
   */
  possibleActions: ActionDefinition<S>[]
  botActivities: BotActionsSet<S>

  /**
   * Direct reference to Bot "players".
   */
  botClients: Bot[] = []

  /**
   * All room's available integration tests
   */
  integrationHooks: Record<string, IntegrationHooks<S>>
  /**
   * Currently running integration test
   * @private
   */
  currentIntegration: { name: string; data: IntegrationHookData }
  /**
   * An object passed down to integration hooks.
   * Contains limited set of methods on room and
   * additional (readonly) data defined in integration itself
   * @private
   */
  integrationContext: IntegrationHookCallbackContext<S>

  /**
   * Count all connected clients, with planned bot players
   */
  get allClientsCount(): number {
    return this.clients.length + this.botClients.length
  }

  get name(): string {
    return this.constructor.name
  }

  /**
   * Run a callback on integration hook, if available
   * @ignore
   */
  _executeIntegrationHook(hookName: IntegrationHookNames): void {
    if (this.currentIntegration) {
      this.integrationHooks[this.currentIntegration.name]?.[hookName]?.(
        this.state,
        this.integrationContext,
      )
    }
  }

  onCreate(options?: RoomCreateOptions): void {
    logs.info(`Room:${this.name}`, "creating new room")

    if (!this.possibleActions) {
      logs.warn(`Room:${this.name}`, "You didn't define any `possibleActions`!")
      this.possibleActions = []
    }

    this.commandsManager = new CommandsManager<S>(this)
    if (this.botActivities) {
      this.botRunner = new BotRunner<S>(this)
    }

    // Register all known messages
    messages.forEach((callback, type) => {
      this.onMessage(type, callback.bind(this))
    })
    this.onMessage("*", fallback.bind(this))

    // Let the game state initialize!
    if (this.stateConstructor) {
      this.setState(new this.stateConstructor())
    } else {
      this.setState(new State() as S)
    }

    if (this.variantsConfig) {
      this.state.variantData = deepMerge({}, this.variantsConfig.defaults)
    }

    this.onInitGame(options)

    if (this.integrationHooks && options?.test in this.integrationHooks) {
      logs.info(
        `Room:${this.name}`,
        "preparing for integration test:",
        options.test,
      )
      this.currentIntegration = {
        name: options.test,
        data: this.integrationHooks[options.test].data ?? {},
      }
      this.integrationContext = {
        addClient: this.addClient.bind(this),
        addBot: this.addBot.bind(this),
        data: Object.freeze(this.currentIntegration.data),
      }
    }
    this._executeIntegrationHook("init")
  }

  /**
   * Add client to `state.clients`
   * @returns `false` is client is already there or if the game is already started
   *
   * @ignore exposed only for testing, do not use
   */
  addClient(sessionId: string): boolean {
    const { state, playersCount } = this

    // DONE: I Want spectators
    // if (state.isGameStarted) {
    //   logs.info("addClient", "state.isGameStarted")
    //   return false
    // }

    /**
     * this.botClients - only bots
     * this.clients - only human players and possible spectators?
     * state.clients - all clients considered to become players when game starts, including bots
     */

    // TODO: move that logic to the ready message
    // const withinPlayerLimits = playersCount?.max
    //   ? this.clients.length < playersCount.max
    //   : true
    // if (!withinPlayerLimits) {
    //   logs.info("addClient failed", "!withinPlayerLimits")
    //   return false
    // }

    const clientAlreadyIn = Array.from(state.clients.values()).some(
      (client) => sessionId === client.id,
    )
    if (clientAlreadyIn) {
      logs.info("addClient failed", "clientAlreadyIn")
      return false
    }
    state.clients.push(new GameClient({ id: sessionId }))
    return true
  }

  addBot(bot: BotOptions): boolean {
    const { state, playersCount } = this

    if (state.isGameStarted) {
      logs.info("addBot failed", "state.isGameStarted")
      return false
    }

    /**
     * this.botClients - only bots
     * this.clients - only human players and possible spectators?
     * state.clients - all clients considered to become players when game starts, including bots
     */

    const withinBotLimits = playersCount?.bots?.max
      ? this.botClients.length < playersCount?.bots.max
      : true

    if (!withinBotLimits) {
      logs.info("addBot failed", "!withinBotLimits")
      return false
    }

    const clientAlreadyIn = Array.from(state.clients.values()).some(
      (client) => bot.clientID === client.id,
    )

    if (clientAlreadyIn) {
      logs.info("addBot failed", "clientAlreadyIn")
      return false
    }

    this.botClients.push(new Bot(bot))
    state.clients.push(
      new GameClient({ id: bot.clientID, isBot: true, ready: true }),
    )
    return true
  }

  /**
   * Remove client from `state.clients`
   *
   * @ignore exposed only for testing, do not use
   */
  removeClient(sessionId: string): boolean {
    /**
     * this.botClients - only bots
     * this.clients - only human players and possible spectators?
     * state.clients - all clients considered to become players when game starts
     */

    const clientIdx = this.state.clients.findIndex((c) => c.id === sessionId)

    if (clientIdx >= 0) {
      this.state.clients.splice(clientIdx, 1)
      return true
    }
    return false
  }

  /**
   * Is called when the client successfully joins the room, after onAuth has succeeded.
   *
   * So we have guarantee, this new client is still within `maxClients` limit.
   */
  onJoin(newClient: Client): void {
    const added = this.addClient(newClient.sessionId)
    const statusString = added ? " and" : `, wasn't`

    logs.log(
      "onJoin",
      `client "${newClient.sessionId}" joined${statusString} added to state.clients`,
    )
  }

  onLeave(client: Client, consented: boolean): void {
    if (consented || !this.state.isGameStarted) {
      this.removeClient(client.sessionId)
      logs.log("onLeave", `client "${client.sessionId}" left permanently`)
    } else {
      logs.log(
        "onLeave",
        `client "${client.sessionId}" disconnected, might be back`,
      )
    }
  }

  clientSend(
    clientID: string,
    type: string | number,
    message?: any,
    options?: ClientSendOptions,
  ): void
  clientSend(
    client: Client,
    type: string | number,
    message?: any,
    options?: ClientSendOptions,
  ): void
  /**
   * For convenience. Wraps message with additional data (like undo)
   */
  clientSend(
    clientIdOrRef: string | Client,
    type: string | number,
    message?: any,
    options?: ClientSendOptions,
  ): void {
    const wrappedMessage: ServerMessage = {
      data: message,
    }
    const cleanOptions: ClientSendOptions = {
      ...options,
    }
    if (options?.undo) {
      wrappedMessage.undo = true
      delete cleanOptions.undo
    }

    const client =
      typeof clientIdOrRef === "string"
        ? this.clients.find((client) => client.sessionId === clientIdOrRef)
        : clientIdOrRef

    if (!client) {
      logs.warn(
        "clientSend",
        `trying to send message to non-existing client "${clientIdOrRef}"`,
      )
    }

    client.send(
      type,
      wrappedMessage,
      Object.keys(cleanOptions).length > 0 ? cleanOptions : undefined,
    )
  }

  /**
   * For convenience. Wraps message with additional data (like undo)
   */
  broadcast<
    T extends keyof AllServerMessageTypes<MoreMessageTypes>,
    // M extends MoreMessageTypes & ServerMessageTypes
  >(
    type: T,
    message?: AllServerMessageTypes<MoreMessageTypes>[T],
    options?: BroadcastOptions,
  ): void {
    const wrappedMessage: ServerMessage = {
      data: message,
    }
    const cleanOptions: BroadcastOptions = {
      ...options,
    }
    if (options?.undo) {
      wrappedMessage.undo = true
      delete cleanOptions.undo
    }

    if (Object.keys(cleanOptions).length > 0) {
      super.broadcast(type as string | number, wrappedMessage, cleanOptions)
    } else {
      super.broadcast(type as string | number, wrappedMessage)
    }
  }

  /**
   * Handles new incoming event from client (human or bot).
   * @returns ~~DEPRECATE - is anyone listening to this return value?...~~ server testing might benefit
   *     `true` if action was executed, `false` if not, or if it failed.
   */
  async handleMessage(message: ServerPlayerMessage): Promise<boolean> {
    let result = false

    debugRoomMessage(message)

    if (!message.player) {
      throw new Error("client is not a player")
    }

    if (this.state.isGameOver) {
      throw new Error("game's already over")
    }

    result = await this.commandsManager.handlePlayerEvent(message)
    // try {
    //   result = await this.commandsManager.handlePlayerEvent(message)
    // } catch (e) {
    //   logs.error("handleMessage FAILED", e.message)
    //   logs.error((e as Error).stack)
    //   return false
    // }

    if (result) {
      this.botRunner?.onAnyMessage()
    }

    return result
  }

  /**
   * Override it to state your own conditions of whether the game can be started or not.
   * @returns {boolean}
   */
  canGameStart(): boolean {
    return true
  }

  /**
   * Will be called right after the game room is created.
   * Create your game state here:
   *
   * ~~```this.setState(new MyState())```~~ DON'T
   *
   * Prepare your play area now.
   *
   * @param state
   */
  onInitGame(options?: RoomCreateOptions): void {
    logs.info("Room", `onInitGame is not implemented!`)
  }

  /**
   * Will be called when clients agree to start the game.
   * `state.players` is already populated with all players.
   * Game options (variant data) is already set.
   * After this function, the game will give turn to the first player.
   * @param state
   */
  onStartGame(): void | Command[] {
    logs.info("Room", `onStartGame is not implemented!`)
  }

  /**
   * Invoked when players turn starts
   */
  onPlayerTurnStarted(player: Player): void | Command[] {
    if (!this.state.turnBased) {
      logs.info("Room", `onPlayerTurnStarted is not implemented!`)
    }
  }

  /**
   * Invoked when players turn ends
   */
  onPlayerTurnEnded(player: Player): void | Command[] {
    if (!this.state.turnBased) {
      logs.info("Room", `onPlayerTurnEnded is not implemented!`)
    }
  }

  /**
   * Invoked when each round starts.
   */
  onRoundStart(): void | Command[] {
    logs.info(
      "Room",
      `"nextRound" action was called, but "room.onRoundStart()" is not implemented!`,
    )
  }

  /**
   * Invoked when a round is near completion.
   */
  onRoundEnd(): void | Command[] {
    logs.info(
      "Room",
      `"nextRound" action was called, but "room.onRoundEnd()" is not implemented!`,
    )
  }

  onDispose(): void {}
}
