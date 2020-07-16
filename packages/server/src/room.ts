import { Client, Room as colRoom } from "colyseus"
import { BroadcastOptions } from "colyseus/lib/Room"

import {
  chalk,
  IS_CHROME,
  logs,
  map2Array,
  mapAdd,
  mapRemoveEntry,
  shuffle,
} from "@cardsgame/utils"

import { ActionsSet } from "./actionTemplate"
import { BotNeuron } from "./bots/botNeuron"
import { BotRunner } from "./bots/runner"
import { Command } from "./command"
import { Sequence } from "./commands"
import { CommandsManager } from "./commandsManager"
import { Bot, BotOptions } from "./players/bot"
import { Player, ServerPlayerEvent } from "./players/player"
import { State } from "./state/state"
import { hasLabel, LabelTrait } from "./traits/label"
import { populatePlayerEvent } from "./utils"

export interface IRoom<S extends State> {
  botActivities?: BotNeuron<S>[]
  canGameStart(): boolean
  onInitGame(options: any): void
  onStartGame(state: S): void | Command[]
  onPlayerTurnStarted(player: Player): void | Command[]
  onPlayerTurnEnded(player: Player): void | Command[]
  onRoundStart(): void | Command[]
  onRoundEnd(): void | Command[]
}

export class Room<S extends State> extends colRoom<S> {
  patchRate = 100 // ms = 10FPS

  commandsManager: CommandsManager<S>
  botRunner: BotRunner<S>

  possibleActions: ActionsSet<S>

  botActivities: BotNeuron<S>[]
  botClients: Bot[] = []

  /**
   * Count all connected clients, with planned bot players
   */
  get allClientsCount(): number {
    return this.clients.length + this.botClients.length
  }

  get name(): string {
    return this.constructor.name
  }

  onCreate(options?: Record<string, any>): void {
    logs.info(`Room:${this.name}`, "creating new room")

    if (!this.possibleActions) {
      logs.warn(`Room:${this.name}`, "You didn't define any `possibleActions`!")
      this.possibleActions = new Set([])
    }

    this.commandsManager = new CommandsManager<S>(this)
    this.botRunner = new BotRunner<S>(this)

    this.onInitGame(options)
  }

  /**
   * Send message to EVERY connected client.
   * @param data
   * @param options
   */
  broadcast(data: ServerMessage, options?: BroadcastOptions): boolean {
    logs.notice("BROADCAST 📢", data)

    return super.broadcast(data, options)
  }

  /**
   * Create and add new Bot player to clients list.
   * @returns clientID of newly created bot, if added successfully.
   */
  protected addBot(botOptions: Omit<BotOptions, "clientID"> = {}): string {
    const { state } = this

    if (state.isGameStarted) {
      return
    }

    const clientID = `botPlayer${this.botClients.length}`
    if (this.addClient(clientID)) {
      const bot = new Bot({
        ...botOptions,
        clientID,
      })
      this.botClients.push(bot)
      return clientID
    }
  }

  /**
   * Add human client or bot to `state.clients`
   */
  protected addClient(id: string): boolean {
    const { state } = this

    // Add to `state.clients` only if the game is not yet started
    if (
      !state.isGameStarted &&
      map2Array(state.clients).every((clientID) => id !== clientID)
    ) {
      mapAdd(state.clients, id)
      return true
    }
    return false
  }

  /**
   * Remove human client or bot from `state.clients`
   */
  protected removeClient(id: string): void {
    mapRemoveEntry(this.state.clients, id)
  }

  onJoin(newClient: Client): void {
    const added = this.addClient(newClient.id)
    logs.notice(
      "onJoin",
      `client "${newClient.id}" joined, ${
        added ? "and" : `wasn't`
      } added to state.clients`
    )
  }

  onLeave(client: Client, consented: boolean): void {
    if (consented || !this.state.isGameStarted) {
      this.removeClient(client.id)
      logs.notice("onLeave", `client "${client.id}" left permanently`)
    } else {
      logs.notice(
        "onLeave",
        `client "${client.id}" disconnected, might be back`
      )
    }
  }

  onMessage(client: Client, event: ClientPlayerEvent): void {
    logs.verbose("\n================[ MESSAGE ]==================\n")

    // Player signals START
    if (event.command === "start") {
      return this.handleGameStart()
      // No need to parse/do anything else
    }
    if (event.command === "add_bot") {
      this.addBot({
        actionDelay: () => Math.random() + 1,
      })
      return
    }

    this.handleMessage(client.id, event).catch((e) =>
      logs.error("ROOM", `action() failed for client: "${client.id}": ${e}`)
    )
  }

  /**
   * Handles new incoming event from client (human or bot).
   * @returns `true` if action was executed, `false` if not, or if it failed.
   */
  async handleMessage(
    clientID: string,
    event: ClientPlayerEvent
  ): Promise<boolean> {
    let result = false
    const newEvent = populatePlayerEvent(this.state, event, clientID)

    if (!newEvent.player) {
      logs.error("parseMessage", "You're not a player, get out!", event)
      return
    }

    debugLogMessage(newEvent)

    if (this.state.isGameOver) {
      logs.warn("handleMessage", "Game's already over!")
      return false
    }

    try {
      result = await this.commandsManager.handlePlayerEvent(newEvent)
    } catch (e) {
      logs.notice("handleMessage FAILED", e.message)
      return false
    }

    if (result) {
      this.botRunner.onAnyMessage()
    }

    return result
  }

  private handleGameStart(): void {
    const { state } = this

    if (state.isGameStarted) {
      logs.notice("onMessage", `Game is already started, ignoring...`)
      return
    }
    if (this.canGameStart && !this.canGameStart()) {
      logs.notice(
        "onMessage",
        `Someone requested game start, but we can't go yet...`
      )
      return
    }

    // We can go, convert all connected "clients" into players
    shuffle(
      this.clients
        .map((client) => new Player({ clientID: client.id }))
        .concat(this.botClients)
    ).forEach((player, idx) => {
      state.players[idx] = player
    })

    state.isGameStarted = true

    const postStartCommands = this.onStartGame(state)

    const postStartup = (): void => {
      if (state.turnBased) {
        this.onPlayerTurnStarted(state.currentPlayer)
        this.botRunner.onPlayerTurnStarted(state.currentPlayer)
      }
      this.onRoundStart()
      this.botRunner.onRoundStart()
    }

    if (postStartCommands) {
      this.commandsManager
        .executeCommand(state, new Sequence("onStartGame", postStartCommands))
        .then(postStartup)
    } else {
      postStartup()
    }
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
  onInitGame(options: any = {}): void {
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
}

function debugLogMessage(newEvent: ServerPlayerEvent): void {
  const minifyTarget = (e: LabelTrait): string => {
    return `${e.type}:${e.name}`
  }
  const minifyPlayer = (p: Player): string => {
    return `${p.name}[${p.clientID}]`
  }

  const entity = hasLabel(newEvent.entity) ? minifyTarget(newEvent.entity) : ""
  const entities =
    newEvent.entities &&
    newEvent.entities
      .map((e) => (hasLabel(e) ? minifyTarget(e) : "?"))
      .join(", ")
  const entityPath =
    newEvent.entityPath && chalk.green(newEvent.entityPath.join(", "))

  const { command, event, data } = newEvent

  const playerString = newEvent.player
    ? `Player: ${minifyPlayer(newEvent.player)} | `
    : ""

  if (IS_CHROME) {
    logs.info(
      "onMessage",
      playerString,
      `${command} "${event}"`,
      `\n\tpath: `,
      entityPath,
      ", ",
      ` entity:`,
      entity,
      `\n\tentities: `,
      entities,
      `\n\tdata: `,
      data
    )
  } else {
    logs.info(
      "onMessage",
      [
        playerString,
        chalk.white.bold(command),
        ` "${chalk.yellow(event)}"`,
        entityPath ? `\n\tpath: [${entityPath}], ` : "",
        entity ? ` entity:"${entity}"` : "",
        entities ? `\n\tentities: [${entities}]` : "",
        data ? `\n\tdata: ${JSON.stringify(data)}` : "",
      ].join("")
    )
  }
}
