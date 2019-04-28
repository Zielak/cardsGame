import colyseus, { Client } from "colyseus"
import { logs } from "./logs"
import { CommandsManager } from "./commandsManager"
import { State } from "./state"
import { IEntity, isInteractive } from "./entities/traits/entity"
import { map2Array, mapAdd, mapRemoveEntry } from "@cardsgame/utils"
import { Player, ServerPlayerEvent } from "./player"
import { ActionsSet } from "./actionTemplate"

export class Room<S extends State> extends colyseus.Room<S> {
  name = "CardsGame test"

  commandsManager: CommandsManager

  possibleActions: ActionsSet

  onInit(options: any) {
    logs.info(`Room:${this.name}`, "creating new room")

    this.commandsManager = new CommandsManager(this.possibleActions)

    this.onSetupGame(options)
  }

  requestJoin(options: any, isRoomNew?: boolean): boolean | number {
    // TODO: private rooms?
    // TODO: reject on maxClients reached?
    // TODO: this.state.isGameStarted
    return true
  }

  onJoin(newClient: Client) {
    // If not on the list already
    if (
      map2Array(this.state.clients).every(clientID => newClient.id !== clientID)
    ) {
      mapAdd(this.state.clients, newClient.id)
    }
    logs.log("onJoin", `client "${newClient.id}" joined`)
  }

  onLeave(client: Client, consented: boolean) {
    if (consented) {
      mapRemoveEntry(this.state.clients, client.id)
      logs.log("onLeave", `client "${client.id}" left permamently`)
    } else {
      logs.log("onLeave", `client "${client.id}" disconnected, might be back`)
    }
  }

  onMessage(client: Client, event: PlayerEvent) {
    if (event.data === "start" && !this.state.isGameStarted) {
      this.onStartGame(this.state)
      return
    } else if (event.data === "start" && this.state.isGameStarted) {
      logs.log("onMessage", `Game is already started, ignoring...`)
      return
    }

    // Populate event with server-side known data
    const newEvent: ServerPlayerEvent = { ...event }
    if (newEvent.entityPath) {
      // Make sure
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
      logs.error("onMessage", `You're no a player, get out!`)
      return
    }
    newEvent.player = player

    const minifyTarget = (e: IEntity) => {
      return `${e.type}:${e.name}`
    }
    const minifyPlayer = (p: Player) => {
      return `${p.name}[${p.clientID}]`
    }
    const logObj = Object.assign(
      { ...newEvent },
      newEvent.entity ? { entity: minifyTarget(newEvent.entity) } : {},
      newEvent.entities
        ? { entities: newEvent.entities.map(minifyTarget) }
        : {},
      newEvent.player ? { player: minifyPlayer(newEvent.player) } : {}
    )
    logs.info("onMessage", JSON.stringify(logObj))

    this.commandsManager
      .action(this.state, client, newEvent)
      .then(data => logs.log(`action() completed`, data))
      .catch(error => logs.error(`action() failed`, error))
  }

  /**
   * Will be called right after the game room is created.
   * Prepare your play area now.
   * @param state
   */
  onSetupGame(options: any = {}) {
    logs.error("Room", `onSetupGame is not implemented!`)
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
