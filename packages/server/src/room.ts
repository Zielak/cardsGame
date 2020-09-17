import { Client, Room as colRoom } from "colyseus"

import { chalk, def, IS_CHROME, logs, shuffle } from "@cardsgame/utils"

import { ActionsSet } from "./actionTemplate"
import { BotNeuron } from "./bots/botNeuron"
import { BotRunner } from "./bots/runner"
import { Command } from "./command"
import { Sequence } from "./commands"
import { CommandsManager } from "./commandsManager"
import { Bot, BotOptions } from "./players/bot"
import { Player, ServerPlayerMessage } from "./players/player"
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

    this.onMessage("start", (client: Client, message: any) => {
      logs.verbose("\n================[ MESSAGE ]==================\n")
      if (!this.state.isGameOver) {
        return this.handleGameStart()
      } else {
        return this.handleGameRestart()
      }
    })

    // TODO: Typedef all these specific message types
    this.onMessage("bot_add", (client, message: { intelligence: number }) => {
      this.addBot({
        actionDelay: () => Math.random() + 0.5,
        intelligence: def(message?.intelligence, 0.5),
      })
    })

    this.onMessage("bot_remove", (client, message: { id: string }) => {
      this.removeBot(message?.id)
    })

    this.onMessage(
      "EntityInteraction",
      (client, message: RawInteractionClientPlayerMessage) => {
        const newMessage = populatePlayerEvent(
          this.state,
          { ...message, messageType: "EntityInteraction" },
          client.id
        )
        this.handleMessage(newMessage).catch((e) =>
          logs.error(
            "ROOM",
            `EntityInteraction failed for client: "${client.id}": ${e}`
          )
        )
      }
    )

    this.onMessage("*", (client, messageType: string, message: any) => {
      const newMessage = populatePlayerEvent(
        this.state,
        { data: message, messageType },
        client.id
      )
      this.handleMessage(newMessage).catch((e) =>
        logs.error(
          "ROOM",
          `message type "${messageType}" failed for client: "${client.id}": ${e}`
        )
      )
    })

    this.onInitGame(options)
  }

  /**
   * Create and add new Bot player to clients list.
   * @returns clientID of newly created bot, if added successfully.
   */
  protected addBot(botOptions: Omit<BotOptions, "clientID"> = {}): void {
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
    }
  }

  /**
   * Remove bot client from `state.clients`
   */
  protected removeBot(id?: string): void {
    const bot = id
      ? this.botClients.find((bot) => bot.clientID === id)
      : this.botClients[this.botClients.length - 1]

    if (bot) {
      this.state.clients.delete(bot.clientID)
      this.botClients = this.botClients.filter((b) => b !== bot)
    }
  }

  /**
   * Add human client to `state.clients`
   * @returns `false` is client is already there or if the game is not yet started
   */
  protected addClient(id: string): boolean {
    const { state } = this

    if (
      !state.isGameStarted &&
      Array.from(state.clients.values()).every((clientID) => id !== clientID)
    ) {
      return typeof state.clients.add(id) === "number"
    }
    return false
  }

  /**
   * Remove human client from `state.clients`
   */
  protected removeClient(id: string): void {
    this.state.clients.delete(id)
  }

  onJoin(newClient: Client): void {
    const added = this.addClient(newClient.id)
    const statusString = added ? " and" : `, wasn't`

    logs.notice(
      "onJoin",
      `client "${newClient.id}" joined${statusString} added to state.clients`
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

  /**
   * Handles new incoming event from client (human or bot).
   * @returns `true` if action was executed, `false` if not, or if it failed.
   */
  async handleMessage(message: ServerPlayerMessage): Promise<boolean> {
    let result = false

    if (!message.player) {
      logs.notice("handleMessage", "You're not a player, get out!", message)
      return false
    }

    debugLogMessage(message)

    if (this.state.isGameOver) {
      logs.notice("handleMessage", "Game's already over!")
      return false
    }

    try {
      result = await this.commandsManager.handlePlayerEvent(message)
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
      logs.notice("handleGameStart", `Game is already started, ignoring...`)
      return
    }
    if (this.canGameStart && !this.canGameStart()) {
      logs.notice(
        "handleGameStart",
        `Someone requested game start, but we can't go yet...`
      )
      return
    }

    // We can go, convert all connected clients into players
    shuffle(
      this.clients
        .map((client) => new Player({ clientID: client.id }))
        .concat(this.botClients)
    ).forEach((player, idx) => {
      state.players[idx] = player
    })

    this.startTheGame()
  }

  /**
   * @deprecated ON HOLD
   * When first creating the room, players give it some options.
   * How would you want to "Restart" the game?
   * Remember those options and quickly restart it or be able to re-configure the room again?
   */
  private handleGameRestart(): void {
    const { state } = this

    // We can go, shuffle players into new seats.
    shuffle(Array.from(state.players.values())).forEach((player, idx) => {
      state.players[idx] = player
    })

    this.startTheGame()
  }

  private startTheGame(): void {
    const { state } = this

    state.isGameStarted = true
    state.isGameOver = false

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

  onDispose(): void {}
}

function debugLogMessage(message: ServerPlayerMessage): void {
  const minifyTarget = (e: LabelTrait): string => {
    return `${e.type}:${e.name}`
  }
  const minifyPlayer = (p: Player): string => {
    return `${p.name}[${p.clientID}]`
  }

  const entity = hasLabel(message.entity) ? minifyTarget(message.entity) : ""
  const entities =
    message.entities &&
    message.entities
      .map((e) => (hasLabel(e) ? minifyTarget(e) : "?"))
      .join(", ")
  const entityPath =
    message.entityPath && chalk.green(message.entityPath.join(", "))

  const { data, event } = message

  const playerString = message.player
    ? `Player: ${minifyPlayer(message.player)} | `
    : ""

  if (IS_CHROME) {
    logs.info(
      "onMessage",
      playerString,
      `${message.messageType}`,
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
        chalk.white.bold(message.messageType),
        event ? ` "${chalk.yellow(event)}"` : "",
        "\n\t",
        entityPath ? `path: [${entityPath}], ` : "",
        entity ? `entity:"${entity}", ` : "",
        entities ? `entities: [${entities}], ` : "",
        data ? `\n\tdata: ${JSON.stringify(data)}` : "",
      ].join("")
    )
  }
}
