import { def } from "@cardsgame/utils"
import { Client } from "colyseus.js"

import { LobbyRoom } from "./lobbyRoom.js"
import { logs } from "./logs.js"
import { Room } from "./room.js"

interface IGameOptions {
  ws?: WSOptions
}

interface WSOptions {
  host?: string
  port?: number
  secure?: boolean
}

/**
 * Get events from the game and put everything on the screen.
 * Provide an interface for the players: play area, settings and others
 */
export class Game {
  client: Client
  room: Room
  lobby: LobbyRoom

  ws: WSOptions

  constructor(options: IGameOptions = {}) {
    logs.debug("GAME", "constructor")

    this.ws = {
      host: def(
        options.ws && options.ws.host,
        window.document.location.hostname,
      ),
      port: def(options.ws && options.ws.port, 2657),
      secure: def(
        options.ws.secure,
        window.document.location.protocol.includes("s"),
      ),
    }

    const portString = this.ws.port ? `:${this.ws.port}` : ""

    this.client = new Client(
      `${this.ws.secure ? "wss" : "ws"}://${this.ws.host}${portString}`,
    )
  }

  /**
   * If connected to game room, will return its session ID
   */
  get sessionID(): string {
    return this.room ? this.room.sessionID : undefined
  }

  async joinLobby(): Promise<LobbyRoom> {
    if (this.lobby) {
      return this.lobby
    }
    this.lobby = new LobbyRoom(await this.client.joinOrCreate("lobby"))

    return this.lobby
  }

  joinOrCreate(roomName: string, options?: RoomCreateOptions): Promise<Room> {
    this.room && this.room.leave()

    return this.client.joinOrCreate(roomName, options).then((room) => {
      this.room = new Room(room)
      return this.room
    })
  }

  create(roomName: string, options?: RoomCreateOptions): Promise<Room> {
    this.room && this.room.leave()

    return this.client.create(roomName, options).then((room) => {
      this.room = new Room(room)
      return this.room
    })
  }

  /**
   * This one is probably useless for game rooms.
   * Use `joinOrCreate` instead.
   */
  join(roomName: string, options?: RoomCreateOptions): Promise<Room> {
    this.room && this.room.leave()

    return this.client.join(roomName, options).then((room) => {
      this.room = new Room(room)
      return this.room
    })
  }

  joinById(roomId: string, options?: RoomCreateOptions): Promise<Room> {
    this.room && this.room.leave()

    return this.client.joinById(roomId, options).then((room) => {
      this.room = new Room(room)
      return this.room
    })
  }

  getAvailableRooms(gameName?: string): Promise<colRoomAvailable[]> {
    return this.client.getAvailableRooms(gameName)
  }

  // TODO: reconsider it, maybe this method is useless?
  destroy(): void {
    logs.debug("GAME", "destroy()")
    if (this.room) {
      this.room.leave()
      this.room = null
    }
  }
}
