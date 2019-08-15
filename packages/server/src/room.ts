import { EventEmitter } from "events"
import { Client, Room as colRoom, Presence } from "colyseus"
import {
  logs,
  chalk,
  map2Array,
  mapAdd,
  mapRemoveEntry
} from "@cardsgame/utils"
import { CommandsManager } from "./commandsManager"
import { State } from "./state"
import { IEntity, isInteractive } from "./traits/entity"
import { Player, ServerPlayerEvent } from "./player"
import { ActionsSet } from "./actionTemplate"
import { Conditions, ConditionsConstructor } from "./conditions"

export class Room<
  S extends State,
  C extends Conditions<S>,
  CC extends ConditionsConstructor<S, C>
> extends colRoom<S> {
  name = "CardsGame test"
  patchRate = 100 // ms = 10FPS

  commandsManager: CommandsManager<S, C, CC>
  emitter = new EventEmitter()
  on: (event: string | symbol, listener: (...args: any[]) => void) => this
  once: (event: string | symbol, listener: (...args: any[]) => void) => this
  off: (event: string | symbol, listener: (...args: any[]) => void) => this
  emit: (event: string | symbol, ...args: any[]) => boolean

  conditions: CC
  possibleActions: ActionsSet<C>

  constructor(presence?: Presence) {
    super(presence)

    this.on = this.emitter.on.bind(this)
    this.once = this.emitter.once.bind(this)
    this.off = this.emitter.off.bind(this)
    this.emit = this.emitter.emit
  }

  onInit(options: any) {
    logs.info(`Room:${this.name}`, "creating new room")

    if (!this.possibleActions) {
      logs.warn(`Room:${this.name}`, "You didn't define any `possibleActions`!")
      this.possibleActions = new Set([])
    }

    this.commandsManager = new CommandsManager<S, C, CC>(this)

    this.onInitGame(options)
  }

  requestJoin(options: any, isRoomNew?: boolean): boolean | number {
    // TODO: private rooms?
    // TODO: reject on maxClients reached?
    return this.state.isGameStarted ? false : true
  }

  onJoin(newClient: Client) {
    // If not on the list already
    if (
      map2Array(this.state.clients).every(clientID => newClient.id !== clientID)
    ) {
      mapAdd(this.state.clients, newClient.id)
    }
    logs.notice("onJoin", `client "${newClient.id}" joined`)
  }

  onLeave(client: Client, consented: boolean) {
    if (consented) {
      mapRemoveEntry(this.state.clients, client.id)
      logs.notice("onLeave", `client "${client.id}" left permamently`)
    } else {
      logs.notice(
        "onLeave",
        `client "${client.id}" disconnected, might be back`
      )
    }
  }

  onMessage(client: Client, event: PlayerEvent) {
    if (event.data === "start" && !this.state.isGameStarted) {
      Object.keys(this.state.clients).forEach((key, idx) => {
        this.state.players[idx] = new Player({
          state: this.state,
          clientID: this.state.clients[key]
        })
      })
      this.state.currentPlayerIdx = 0
      this.state.isGameStarted = true
      this.onStartGame(this.state)
      this.emit(State.events.playerTurnStarted)
      return
    } else if (event.data === "start" && this.state.isGameStarted) {
      logs.notice("onMessage", `Game is already started, ignoring...`)
      return
    }

    // Populate event with server-side known data
    const newEvent: ServerPlayerEvent = { ...event }
    if (newEvent.entityPath) {
      newEvent.entities = this.state
        .getEntitiesAlongPath(newEvent.entityPath)
        .reverse()
        .filter(target => isInteractive(target))
      newEvent.entity = newEvent.entities[0]
    }

    const player = map2Array<Player>(this.state.players).find(
      p => p.clientID === client.id
    )
    if (!player) {
      logs.error("onMessage", `You're not a player, get out!`)
      return
    }
    newEvent.player = player

    debugLogMessage(newEvent)

    this.commandsManager
      .action(client, newEvent)
      .then(data => logs.notice(`action() completed`, data))
      .catch(error => logs.error(`action() failed`, error))
  }

  /**
   * Will be called right after the game room is created.
   * Prepare your play area now.
   * @param state
   */
  onInitGame(options: any = {}) {
    logs.error("Room", `onInitGame is not implemented!`)
  }

  /**
   * Will be called when players agree to start the game.
   * Now is the time to for example deal cards to all players.
   * @param state
   */
  onStartGame(state: State) {
    logs.error("Room", `onStartGame is not implemented!`)
  }
}

const debugLogMessage = (newEvent: ServerPlayerEvent) => {
  const minifyTarget = (e: IEntity) => {
    return `${e.type}:${e.name}`
  }
  const minifyPlayer = (p: Player) => {
    return `${p.name}[${p.clientID}]`
  }

  const entity = newEvent.entity && minifyTarget(newEvent.entity)
  const entities =
    newEvent.entities && newEvent.entities.map(minifyTarget).join(", ")
  const entityPath =
    newEvent.entityPath && chalk.green(newEvent.entityPath.join(", "))

  const { command, event } = newEvent

  if (process.env.LOGS_CHROME) {
    logs.info(
      "onMessage",
      `Player: ${minifyPlayer(newEvent.player)} | `,
      `${command} "${event}"`,
      `\n\tpath: `,
      entityPath,
      ", ",
      ` entity:`,
      entity,
      `\n\tentities: `,
      entities
    )
  } else {
    logs.info(
      "onMessage",
      [
        `Player: ${minifyPlayer(newEvent.player)} | `,
        chalk.white.bold(command),
        ` "${chalk.yellow(event)}"`,
        entityPath ? `\n\tpath: [${entityPath}], ` : "",
        entity ? ` entity:"${entity}"` : "",
        entities ? `\n\tentities: [${entities}]` : ""
      ].join("")
    )
  }
}

export type EntityProps = {
  [key: string]: boolean | string | number | string[] | number[] | EntityProps
  name?: string | string[]
  type?: string | string[]
  value?: number | number[]
  rank?: string | string[]
  suit?: string | string[]
  parent?: EntityProps
}

export type InteractionDefinition = EntityProps & {
  command?: string
  event?: string
}
