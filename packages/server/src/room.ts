import { Client, Room as colRoom } from "colyseus"
import {
  logs,
  chalk,
  map2Array,
  mapAdd,
  mapRemoveEntry,
  IS_CHROME
} from "@cardsgame/utils"
import { CommandsManager } from "./commandsManager"
import { State } from "./state"
import { IEntity } from "./traits/entity"
import { Player, ServerPlayerEvent } from "./player"
import { ActionsSet } from "./actionTemplate"
import { populatePlayerEvent } from "./utils"
import { BroadcastOptions } from "colyseus/lib/Room"

export class Room<S extends State> extends colRoom<S> {
  name = "CardsGame test"
  patchRate = 100 // ms = 10FPS

  commandsManager: CommandsManager<S>

  possibleActions: ActionsSet<S>

  onInit(options: any) {
    logs.info(`Room:${this.name}`, "creating new room")

    if (!this.possibleActions) {
      logs.warn(`Room:${this.name}`, "You didn't define any `possibleActions`!")
      this.possibleActions = new Set([])
    }

    this.commandsManager = new CommandsManager<S>(this)

    this.onInitGame(options)
  }

  requestJoin(options: any, isRoomNew?: boolean): boolean | number {
    // TODO: private rooms?
    // TODO: reject on maxClients reached?
    return this.state.isGameStarted ? false : true
  }

  broadcast(data: any, options?: BroadcastOptions) {
    logs.notice("BROADCAST 📢", data)

    return super.broadcast(data, options)
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

      // Initial play started "event".
      this.onPlayerTurnStarted(this.state.currentPlayer)
      return
    } else if (event.data === "start" && this.state.isGameStarted) {
      logs.notice("onMessage", `Game is already started, ignoring...`)
      return
    }

    const newEvent = populatePlayerEvent(this.state, event, client)

    if (!newEvent.player) {
      logs.error("onMessage", "You're not a player, get out!")
      return
    }

    debugLogMessage(newEvent)

    const result = this.commandsManager.action(client, newEvent)
    if (result) {
      logs.notice("ROOM", "action() completed")
    } else {
      logs.error("ROOM", "action() failed")
    }
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
   * Will be called when clients agree to start the game.
   * `state.players` is already populated with all players.
   * After this function, the game will give turn to the first player.
   * @param state
   */
  onStartGame(state: State) {
    logs.error("Room", `onStartGame is not implemented!`)
  }

  /**
   * Invoked when players turn starts
   */
  onPlayerTurnStarted(player: Player) {
    logs.error("Room", `onPlayerTurnStarted is not implemented!`)
  }

  /**
   * Invoked when players turn ends
   */
  onPlayerTurnEnded(player: Player) {
    logs.error("Room", `onPlayerTurnEnded is not implemented!`)
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
      entities
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
