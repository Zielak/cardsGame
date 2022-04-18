import { logs } from "@cardsgame/utils"
import { Client, Room as colRoom } from "@colyseus/core"
import type { IBroadcastOptions } from "@colyseus/core/build/Room"

import type { ActionsSet } from "./actionTemplate"
import type { BotNeuron } from "./bots/botNeuron"
import { BotRunner } from "./bots/runner"
import type { Command } from "./command"
import { CommandsManager } from "./commandsManager"
import { fallback } from "./messages/fallback"
import { messages } from "./messages/messageHandler"
import type { Player, ServerPlayerMessage } from "./player"
import type { Bot } from "./player/bot"
import type { State } from "./state"
import { debugRoomMessage } from "./utils/debugRoomMessage"

export interface IRoom<S extends State> {
  botActivities?: BotNeuron<S>[]
  canGameStart(): boolean
  onInitGame(options: Record<string, any>): void
  onStartGame(state: S): void | Command[]
  onPlayerTurnStarted(player: Player): void | Command[]
  onPlayerTurnEnded(player: Player): void | Command[]
  onRoundStart(): void | Command[]
  onRoundEnd(): void | Command[]
}

type BroadcastOptions = IBroadcastOptions & {
  undo: boolean
}

type IntegrationHookCallback<S extends State> = (state: S) => void
/**
 * Depending on integration tests I might allow more hooks.
 */
type IntegrationHookNames = "init" | "startPre" | "startPost"
/**
 * Pass { test: "integrationTestName" } while creating the room.
 * Your integration test callbacks will be executed on init or start hooks.
 */
export type IntegrationHooks<S extends State = State> = Partial<
  Record<IntegrationHookNames, IntegrationHookCallback<S>>
>

export class Room<S extends State> extends colRoom<S> {
  patchRate = 100 // ms = 10FPS

  commandsManager: CommandsManager<S>
  botRunner: BotRunner<S>

  possibleActions: ActionsSet<S>

  botActivities: BotNeuron<S>[]
  botClients: Bot[] = []

  /**
   * All room's available integration tests
   */
  integrationHooks: Record<string, IntegrationHooks<S>>
  /**
   * Currently running integration test
   */
  currentIntegration: string

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
      this.integrationHooks[this.currentIntegration]?.[hookName]?.(this.state)
    }
  }

  onCreate(options?: Record<string, any>): void {
    logs.info(`Room:${this.name}`, "creating new room")

    if (!this.possibleActions) {
      logs.warn(`Room:${this.name}`, "You didn't define any `possibleActions`!")
      this.possibleActions = new Set([])
    }

    this.commandsManager = new CommandsManager<S>(this)
    this.botRunner = new BotRunner<S>(this)

    // Register all known messages
    messages.forEach((callback, type) => {
      this.onMessage(type, callback.bind(this))
    })
    this.onMessage("*", fallback.bind(this))

    this.onInitGame(options)

    if (this.integrationHooks && options?.test in this.integrationHooks) {
      logs.info(
        `Room:${this.name}`,
        "preparing for integration test:",
        options.test
      )
      this.currentIntegration = options.test
    }
    this._executeIntegrationHook("init")
  }

  /**
   * Add human client to `state.clients`
   * @returns `false` is client is already there or if the game is not yet started
   */
  protected addClient(sessionId: string): boolean {
    const { state } = this

    if (
      !state.isGameStarted &&
      Array.from(state.clients.values()).every(
        (clientID) => sessionId !== clientID
      )
    ) {
      state.clients.push(sessionId)
      return true
    }
    return false
  }

  /**
   * Remove human client from `state.clients`
   */
  protected removeClient(sessionId: string): void {
    const clientIndex = this.state.clients.indexOf(sessionId)
    this.state.clients.splice(clientIndex, 1)
  }

  onJoin(newClient: Client): void {
    const added = this.addClient(newClient.sessionId)
    const statusString = added ? " and" : `, wasn't`

    logs.log(
      "onJoin",
      `client "${newClient.sessionId}" joined${statusString} added to state.clients`
    )
  }

  onLeave(client: Client, consented: boolean): void {
    if (consented || !this.state.isGameStarted) {
      this.removeClient(client.sessionId)
      logs.log("onLeave", `client "${client.sessionId}" left permanently`)
    } else {
      logs.log(
        "onLeave",
        `client "${client.sessionId}" disconnected, might be back`
      )
    }
  }

  broadcast(
    type: string | number,
    message?: any,
    options?: BroadcastOptions
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
      super.broadcast(type, wrappedMessage, cleanOptions)
    } else {
      super.broadcast(type, wrappedMessage)
    }
  }

  /**
   * Handles new incoming event from client (human or bot).
   * @returns `true` if action was executed, `false` if not, or if it failed.
   */
  async handleMessage(message: ServerPlayerMessage): Promise<boolean> {
    let result = false

    debugRoomMessage(message)

    if (!message.player) {
      logs.log("handleMessage", "You're not a player, get out!")
      return false
    }

    if (this.state.isGameOver) {
      logs.log("handleMessage", "Game's already over!")
      return false
    }

    try {
      result = await this.commandsManager.handlePlayerEvent(message)
    } catch (e) {
      logs.log("handleMessage FAILED", e.message)
      return false
    }

    if (result) {
      this.botRunner.onAnyMessage()
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
   * Create your game state here: `this.setState(new MyState())`.
   * Prepare your play area now.
   * @param state
   */
  onInitGame(options?: Record<string, any>): void {
    logs.info("Room", `onInitGame is not implemented!`)
  }

  /**
   * Will be called when clients agree to start the game.
   * `state.players` is already populated with all players.
   * After this function, the game will give turn to the first player.
   * @param state
   */
  onStartGame(state: State): void | Command[] {
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
      `"nextRound" action was called, but "room.onRoundStart()" is not implemented!`
    )
  }

  /**
   * Invoked when a round is near completion.
   */
  onRoundEnd(): void | Command[] {
    logs.info(
      "Room",
      `"nextRound" action was called, but "room.onRoundEnd()" is not implemented!`
    )
  }

  onDispose(): void {}
}
