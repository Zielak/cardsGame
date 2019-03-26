import { Room as colRoom, Client } from "colyseus"
import { logs } from "./logs"
import { CommandsManager } from "./commandsManager"
import { StartGame } from "./commands/startGame"
import { State } from "./state"
import { Entity } from "./entity"
import {
  EntityEvents,
  map2Array,
  mapAdd,
  mapRemoveEntry
} from "@cardsgame/utils"
import { Player, ServerPlayerEvent } from "./player"
import { ActionsSet } from "./actionTemplate"
import chalk from "chalk"

export class Room<S extends State> extends colRoom<S> {
  name = "CardsGame test"

  commandsManager: CommandsManager

  possibleActions: ActionsSet

  onInit(options: any) {
    logs.info(`Room:${this.name}`, "creating new room")
    this.setState(
      new State({
        minClients: options.minClients || 1,
        maxClients: options.maxClients || 4,
        hostID: options.hostID
      })
    )
    this.commandsManager = new CommandsManager(this.possibleActions)

    this.setupPrivatePropsSync()
    this.onSetupGame(this.state)
  }

  /**
   * Start listening for private prop changes of any existing entity
   */
  setupPrivatePropsSync() {
    this.state.on(
      EntityEvents.privateAttributeChange,
      (data: PrivateAttributeChangeData) => {
        // logs.verbose(`privateAttributeChange`, 'public?', data.public)
        if (data.public) {
          this.broadcast({
            data,
            event: EntityEvents.privateAttributeChange
          } as ServerMessage)
        } else {
          const client = this.clients.find(c => c.id === data.owner)
          if (client) {
            const logAttrChange = (data: PrivateAttributeChangeData) => {
              return `[${data.path.join(",")}], (${
                data.public ? "public" : "private"
              }) owner: '${chalk.green(data.owner)}' => ${chalk.yellow(
                data.attribute
              )} = ${chalk.yellow(data.value)}`
            }

            logs.log(
              `privateAttributeChange`,
              "sending data to client",
              client.id,
              logAttrChange(data)
            )
            this.send(client, {
              data,
              event: EntityEvents.privateAttributeChange
            } as ServerMessage)
          } else {
            logs.log(`couldn't find the client to sent it to`, data.owner, data)
          }
        }
      }
    )
  }

  // I don't think I even need to call this function
  // removePlayer(clientID: string) {
  //   // TODO: What about all player's cards and stuff?
  //   // I want those cards back, or be discarded, or put back into deck?
  //   //  ###==> OR make the game author decide what happens. <==###
  //   const player = map2Array(this.state.players)
  //     .find(data => data.clientID === clientID)
  //   const playerIdx = player.entity.idx
  //   if (!player) {
  //     logs.error(
  //       "removePlayer",
  //       `can't find player's data, removed already?`,
  //       clientID
  //     )
  //   }
  //   this.state.entities.removeChild(player.entity.id)
  //   mapRemove(this.state.players, playerIdx)

  //   // this.updatePlayers()
  //   this.state.logTreeState()
  // }

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

    // this.state.emit(State.events.privatePropsSyncRequest, newClient.id)
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
      new StartGame().execute(this.state)
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
        .filter(target => target.interactive)
      newEvent.entity = newEvent.entities[0]
    }

    const playerData = map2Array(this.state.players).find(
      playerData => playerData.clientID === client.id
    )
    if (!playerData) {
      logs.error("onMessage", `You're no a player, get out!`)
      return
    }
    newEvent.player = this.state.getEntity(playerData.entityID) as Player

    const minifyTarget = (e: Entity) => {
      return `${e.type}:${e.name}`
    }
    const minifyPlayer = (p: Player) => {
      return `${p.type}:${p.name}[${p.clientID}]`
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
  onSetupGame(state: State) {
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
