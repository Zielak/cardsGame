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
import { Player, ServerPlayerEvent } from "./player"
import { ActionsSet } from "./actionTemplate"
import { populatePlayerEvent } from "./utils"
import { BroadcastOptions } from "colyseus/lib/Room"
import { LabelTrait, hasLabel } from "./traits"

export class Room<S extends State> extends colRoom<S> {
  name = "CardsGame test"
  patchRate = 100 // ms = 10FPS

  commandsManager: CommandsManager<S>

  possibleActions: ActionsSet<S>

  onCreate(options: any) {
    logs.info(`Room:${this.name}`, "creating new room")

    if (!this.possibleActions) {
      logs.warn(`Room:${this.name}`, "You didn't define any `possibleActions`!")
      this.possibleActions = new Set([])
    }

    this.commandsManager = new CommandsManager<S>(this)

    this.onInitGame(options)
  }

  /**
   * Send message to EVERY connected client.
   * @param data
   * @param options
   */
  broadcast(data: ServerMessage, options?: BroadcastOptions) {
    logs.notice("BROADCAST 📢", data)

    return super.broadcast(data, options)
  }

  onJoin(newClient: Client) {
    // Add to `state.clients` only if the game is not yet started
    if (
      !this.state.isGameStarted &&
      map2Array(this.state.clients).every(clientID => newClient.id !== clientID)
    ) {
      mapAdd(this.state.clients, newClient.id)
    }

    logs.notice("onJoin", `client "${newClient.id}" joined`)
  }

  onLeave(client: Client, consented: boolean) {
    if (consented || !this.state.isGameStarted) {
      mapRemoveEntry(this.state.clients, client.id)
      logs.notice("onLeave", `client "${client.id}" left permamently`)
    } else {
      logs.notice(
        "onLeave",
        `client "${client.id}" disconnected, might be back`
      )
    }
  }

  onMessage(client: Client, event: ClientPlayerEvent) {
    if (event.data === "start") {
      this.handleGameStart()
    }

    const newEvent = populatePlayerEvent(this.state, event, client)

    if (!newEvent.player) {
      logs.error("onMessage", "You're not a player, get out!")
      return
    }

    debugLogMessage(newEvent)

    this.commandsManager
      .action(client, newEvent)
      .then(result => {
        logs.notice("ROOM", "action() completed, result:", result)
      })
      .catch(error => {
        logs.error("ROOM", `action() failed. Client: "${client.id}". ${error}`)
      })
  }

  handleGameStart() {
    if (!this.state.isGameStarted) {
      if (this.canGameStart && !this.canGameStart()) {
        logs.notice(
          "onMessage",
          `Someone requested game start, but we can't go yet...`
        )
        return
      }

      Object.keys(this.state.clients).forEach((key, idx) => {
        this.state.players[idx] = new Player({
          clientID: this.state.clients[key]
        })
      })
      this.state.isGameStarted = true
      this.onStartGame(this.state)

      // Initial play started "event".
      this.onPlayerTurnStarted(this.state.currentPlayer)
      return
    } else if (this.state.isGameStarted) {
      logs.notice("onMessage", `Game is already started, ignoring...`)
      return
    }
  }

  /**
   * Override it to state your own conditions of whether the game can be started or not.
   * @returns {boolean}
   */
  canGameStart() {
    return true
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
    if (!this.state.turnBased) {
      logs.error("Room", `onPlayerTurnStarted is not implemented!`)
    }
  }

  /**
   * Invoked when players turn ends
   */
  onPlayerTurnEnded(player: Player) {
    if (!this.state.turnBased) {
      logs.error("Room", `onPlayerTurnEnded is not implemented!`)
    }
  }

  /**
   * Invoked when each round starts.
   */
  onRoundStart() {
    logs.error(
      "Room",
      `"nextRound" action was called, but "room.onRoundStart()" is not implemented!`
    )
  }

  /**
   * Invoked when a round is near completion.
   */
  onRoundEnd() {
    logs.error(
      "Room",
      `"nextRound" action was called, but "room.onRoundEnd()" is not implemented!`
    )
  }
}

const debugLogMessage = (newEvent: ServerPlayerEvent) => {
  const minifyTarget = (e: LabelTrait) => {
    return `${e.type}:${e.name}`
  }
  const minifyPlayer = (p: Player) => {
    return `${p.name}[${p.clientID}]`
  }

  const entity = hasLabel(newEvent.entity) ? minifyTarget(newEvent.entity) : ""
  const entities =
    newEvent.entities &&
    newEvent.entities.map(e => (hasLabel(e) ? minifyTarget(e) : "?")).join(", ")
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
