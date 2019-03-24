import * as colyseus from "colyseus.js"
import { EntityEvents } from "@cardsgame/utils"
import { Room, PlayerData } from "./room"
import { logs } from "./logs"
import { EventEmitter } from "eventemitter3"
import * as app from "./app"
import { RoomAvailable } from "colyseus.js/lib/Room"

const VIEW_WIDTH = 600
const VIEW_HEIGHT = 600

interface GameOptions {
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
  app: app.App
  room: Room

  gameNames: string[]
  viewElement: HTMLElement

  listAllRoomsInterval: NodeJS.Timeout

  constructor({ gameNames, viewElement }: GameOptions) {
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

    this.app = new app.App({
      viewElement,
      viewWidth: VIEW_WIDTH,
      viewHeight: VIEW_HEIGHT,
      clientID: this.client.id
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
    this.app.destroy()

    const gameRoom = this.client.join(gameName)
    this.room = new Room(gameRoom)

    this.room.once(Room.events.join, () =>
      this.emit(Game.events.joinedRoom, gameName)
    )

    // Create renderer
    this.app.create()
    // Hook it up to room events
    // this.prepareRoomEvents()
    this.prepareRenderingApp()
  }

  // TODO: I shouldn't be passing events like that
  //       clients can simply: `game.room.on()`...
  // prepareRoomEvents() {
  //   this.room.on(Room.events.stateChange, state => {
  //     this.emit(Room.events.stateChange, state)
  //   })
  //   this.room.on(Room.events.join, () => {
  //     this.emit(Room.events.join)
  //   })
  //   this.room.on(Room.events.leave, () => {
  //     this.emit(Room.events.leave)
  //   })
  //   this.room.on(Room.events.error, err => {
  //     this.emit(Room.events.error, err)
  //   })
  //   this.room.on(Room.events.clientJoined, () => {
  //     this.emit(Room.events.clientJoined)
  //   })
  //   this.room.on(Room.events.clientLeft, () => {
  //     this.emit(Room.events.clientLeft)
  //   })
  //   this.room.on(Room.events.message, (message: ServerMessage) => {
  //     this.emit(Room.events.message, message)
  //   })
  // }

  prepareRenderingApp() {
    // this.gameRoom.on(Room.events.clientJoined, (data: string) => {})
    // this.gameRoom.on(Room.events.clientLeft, (data: string) => {})
    this.room.on(Room.events.playerAdded, (data: PlayerData) => {
      this.app.emit(Room.events.playerAdded, data)
    })
    this.room.on(Room.events.playerRemoved, (data: PlayerData) => {
      this.app.emit(Room.events.playerRemoved, data)
    })

    this.room.on(EntityEvents.childRemoved, this.app.removeChild.bind(this.app))
    this.room.on(EntityEvents.childAdded, this.app.addChild.bind(this.app))

    const publicAttributes = [
      // Basic things
      "x",
      "y",
      "angle",
      // ClassicCards stuff
      "faceUp",
      "marked",
      "rotated"
    ]
    publicAttributes.forEach(propName => {
      this.room.on(
        `child.attribute.${propName}`,
        this.app.attributeChange.bind(this.app)
      )
    })

    const privateAttributes = [
      "visibleToClient",
      "selected",
      "suit",
      "rank",
      "name"
    ]
    privateAttributes.forEach(propName => {
      this.room.on(
        `visibility.${propName}`,
        this.app.visibilityChange.bind(this.app)
      )
    })

    // -------

    this.app.on("click", (event: app.ClickEvent) => {
      const playerEvent: PlayerEvent = {
        command: "EntityInteraction",
        event: event.type,
        entityPath: event.targetEntity.idxPath
      }
      this.room.send(playerEvent)
    })
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

    if (this.app) {
      this.app.destroy()
      this.app = null
    }

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
