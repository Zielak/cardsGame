import { def } from "@cardsgame/utils"
import { Client } from "colyseus.js"

import { LobbyRoom } from "./lobbyRoom.js"
import { logs } from "./logs.js"
import { Room } from "./room.js"

interface IGameOptions {
  wss?: WSSOptions
}

interface WSSOptions {
  host?: string
  port?: number
}

/**
 * Get events from the game and put everything on the screen.
 * Provide an interface for the players: play area, settings and others
 */
export class Game {
  client: Client
  room: Room
  lobby: LobbyRoom

  wss: WSSOptions

  constructor(options: IGameOptions = {}) {
    logs.debug("GAME", "constructor")

    this.wss = {
      host: def(
        options.wss && options.wss.host,
        window.document.location.hostname,
      ),
      port: def(options.wss && options.wss.port, 2657),
    }

    const portString = this.wss.port ? `:${this.wss.port}` : ""

    this.client = new Client(`wss://${this.wss.host}${portString}`)
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
