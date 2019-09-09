import { logs, def } from "@cardsgame/utils"
import { Client } from "colyseus.js"
import { Room } from "./room"

interface IGameOptions {
  viewElement: HTMLElement
  roomNames: string[]
  wss?: WSSOptions
}

interface WSSOptions {
  host?: string
  port?: number
}

// It's a copy straight from colyseus.js...
interface RoomAvailable {
  roomId: string
  clients: number
  maxClients: number
  metadata?: any
}

/**
 * Get events from the game and put everything on the screen.
 * Provide an interface for the players: play area, settings and others
 */
export class Game {
  client: Client
  room: Room

  roomNames: string[]
  viewElement: HTMLElement
  wss: WSSOptions

  constructor(options: IGameOptions) {
    logs.verbose("GAME", "constructor")
    const { roomNames, viewElement } = options

    this.roomNames = roomNames
    this.viewElement = viewElement
    this.wss = {
      host: def(
        options.wss && options.wss.host,
        window.document.location.hostname
      ),
      port: def(options.wss && options.wss.port, 2657)
    }

    this.init()
  }

  init() {
    import(/* webpackChunkName: 'colyseus.js' */ "colyseus.js")
      .then(({ Client }) => {
        this.client = new Client(
          `wss://${this.wss.host}${this.wss.port ? ":" + this.wss.port : ""}`
        )
      })
      .catch(err => {
        logs.error("Game", "couldn't load Client from `colyseus.js`", err)
      })
  }

  get sessionID() {
    return this.room ? this.room.sessionID : undefined
  }

  joinOrCreate(roomName: string, options?: any) {
    this.room && this.room.leave()

    return this.client.joinOrCreate(roomName, options).then(room => {
      this.room = new Room(room)
      return this.room
    })
  }

  create(roomName: string, options?: any) {
    this.room && this.room.leave()

    return this.client.create(roomName, options).then(room => {
      this.room = new Room(room)
      return this.room
    })
  }

  /**
   * This one is probably useless for game rooms.
   * Use `joinOrCreate` instead.
   */
  join(roomName: string, options?: any) {
    this.room && this.room.leave()

    return this.client.join(roomName, options).then(room => {
      this.room = new Room(room)
      return this.room
    })
  }

  joinById(roomId: string, options?: any) {
    this.room && this.room.leave()

    return this.client.joinById(roomId, options).then(room => {
      this.room = new Room(room)
      return this.room
    })
  }

  getAvailableRooms(gameName: string): Promise<RoomAvailable[]> {
    return this.client.getAvailableRooms(gameName)
  }

  sendInteraction(event, entityIdxPath: number[]) {
    const playerEvent: PlayerEvent = {
      command: "EntityInteraction",
      event: event.type,
      entityPath: entityIdxPath
    }
    logs.notice("sendInteraction", playerEvent)
    this.room.send(playerEvent)
  }

  send(event: PlayerEvent) {
    this.room.send(event)
  }

  // TODO: reconsider it, maybe this method is useless?
  destroy() {
    logs.verbose("GAME", "destroy()")
    if (this.room) {
      this.room.leave()
      this.room = null
    }
  }

  static events = {
    clientOpen: Symbol("clientOpen"),
    clientClose: Symbol("clientClose"),
    joinedRoom: Symbol("joinedRoom")
    // clientOpen: Symbol("clientOpen")
  }
}
