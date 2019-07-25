import { EventEmitter } from "eventemitter3"
import { logs } from "./logs"

interface IGameOptions {
  viewElement: HTMLElement
  gameNames?: string[]
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
export class Game extends EventEmitter {
  client
  room

  gameNames: string[]
  viewElement: HTMLElement

  constructor({ gameNames, viewElement }: IGameOptions) {
    super()

    this.gameNames = gameNames
    this.viewElement = viewElement

    this.openClient()
  }

  openClient() {
    import(/* webpackChunkName: 'colyseus.js' */ "colyseus.js")
      .then(({ Client }) => {
        const host = window.document.location.hostname
        const port = ":2657"

        this.client = new Client("wss://" + host + port)

        this.client.onOpen.add(data => {
          logs.info("CLIENT open", data)
          this.emit(Game.events.clientOpen)
        })

        this.client.onClose.add(() => {
          this.emit(Game.events.clientClose)
          this.destroy()
        })
      })
      .catch(err => {
        logs.error("Game", "couldn't load Client from `colyseus.js`", err)
      })
  }

  joinRoom(gameName: string) {
    if (this.room) {
      this.room.leave()
    }
    // this.app.destroy()

    this.room = this.client.join(gameName)
    return this.room
  }

  getAvailableRooms(gameName: string): Promise<RoomAvailable[]> {
    return new Promise((resolve, reject) => {
      this.client.getAvailableRooms(gameName, (rooms, err) =>
        err ? reject(err) : resolve(rooms)
      )
    })
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

  destroy() {
    this.client.close()

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
