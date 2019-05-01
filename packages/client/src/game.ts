import * as colyseus from "colyseus.js"
import { Room } from "./room"
import { logs } from "./logs"
import { EventEmitter } from "eventemitter3"
import { RoomAvailable } from "colyseus.js/lib/Room"

interface IGameOptions {
  viewElement: HTMLElement
  gameNames?: string[]
}

/**
 * Renderer
 * Get events from the game and put everything on the screen.
 * Provide an interface for the players: play area, settings and others
 */
export class Game extends EventEmitter {
  client: colyseus.Client
  room: Room

  gameNames: string[]
  viewElement: HTMLElement

  constructor({ gameNames, viewElement }: IGameOptions) {
    super()

    this.gameNames = gameNames
    this.viewElement = viewElement

    const host = window.document.location.hostname
    const port = window.document.location.port ? ":" + 2657 : ""
    this.client = new colyseus.Client("ws://" + host + port)

    this.client.onOpen.add(data => {
      logs.info("CLIENT open", data)
      this.emit(Game.events.clientOpen)
    })

    this.client.onClose.add(() => {
      this.emit(Game.events.clientClose)
      this.destroy()
    })

    // Hot module replacement - there can be only one app on page plz
    document.dispatchEvent(new Event("destroy"))
    document.addEventListener("destroy", () => {
      this.destroy()
    })
  }

  joinRoom(gameName: string) {
    if (this.room) {
      this.room.destroy()
    }
    // this.app.destroy()

    const gameRoom = this.client.join(gameName)
    this.room = new Room(gameRoom)

    this.room.once(Room.events.join, () =>
      this.emit(Game.events.joinedRoom, gameName)
    )
  }

  /**
   * @deprecated
   */
  prepareRenderingApp() {
    // this.gameRoom.on(Room.events.clientJoined, (data: string) => {})
    // this.gameRoom.on(Room.events.clientLeft, (data: string) => {})
    // this.room.on(Room.events.playerAdded, (data: PlayerData) => {
    //   this.app.emit(Room.events.playerAdded, data)
    // })
    // this.room.on(Room.events.playerRemoved, (data: PlayerData) => {
    //   this.app.emit(Room.events.playerRemoved, data)
    // })
    // this.room.on(EntityEvents.childRemoved, this.app.removeChild.bind(this.app))
    // this.room.on(EntityEvents.childAdded, this.app.addChild.bind(this.app))
    // publicAttributes.forEach(propName => {
    //   this.room.on(
    //     `child.attribute.${propName}`,
    //     this.app.attributeChange.bind(this.app)
    //   )
    // })
    // const privateAttributes = [
    //   "visibleToClient",
    //   "selected",
    //   "suit",
    //   "rank",
    //   "name"
    // ]
    // privateAttributes.forEach(propName => {
    //   this.room.on(
    //     `visibility.${propName}`,
    //     this.app.visibilityChange.bind(this.app)
    //   )
    // })
    // -------
    // this.on("click", (event: app.ClickEvent) => {
    //   const playerEvent: PlayerEvent = {
    //     command: "EntityInteraction",
    //     event: event.type,
    //     entityPath: event.targetEntity.idxPath
    //   }
    //   this.room.send(playerEvent)
    // })
  }

  getAvailableRooms(gameName: string): Promise<RoomAvailable[]> {
    return new Promise((resolve, reject) => {
      this.client.getAvailableRooms(gameName, (rooms, err) =>
        err ? reject(err) : resolve(rooms)
      )
    })
  }

  send(event: PlayerEvent) {
    this.room.send(event)
  }

  destroy() {
    this.client.close()

    if (this.room) {
      this.room.destroy()
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
