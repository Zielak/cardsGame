import * as colyseus from "colyseus.js"
import { EntityEvents } from "@cardsgame/utils"
import { Room, PlayerData } from "./room"
import { logs } from "./logs"
import { ClientPlayerEvent } from "./types"
import { EventEmitter } from "eventemitter3"
import * as app from "./app"

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
  gameRoom: Room

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

      // Create renderer
      this.app.create()

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
    const gameRoom = this.client.join(gameName)
    this.gameRoom = new Room(gameRoom)

    this.prepareRenderingApp()
  }

  prepareRenderingApp() {
    // this.gameRoom.on(Room.events.clientJoined, (data: string) => {})
    // this.gameRoom.on(Room.events.clientLeft, (data: string) => {})
    this.gameRoom.on(Room.events.playerAdded, (data: PlayerData) => {
      this.app.emit(Room.events.playerAdded, data)
    })
    this.gameRoom.on(Room.events.playerRemoved, (data: PlayerData) => {
      this.app.emit(Room.events.playerRemoved, data)
    })

    this.gameRoom.on(
      EntityEvents.childRemoved,
      this.app.removeChild.bind(this.app)
    )
    this.gameRoom.on(EntityEvents.childAdded, this.app.addChild.bind(this.app))

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
      this.gameRoom.on(
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
      this.gameRoom.on(
        `visibility.${propName}`,
        this.app.visibilityChange.bind(this.app)
      )
    })

    // -------

    this.app.on("click", (event: app.ClickEvent) => {
      const playerEvent: ClientPlayerEvent = {
        type: event.type,
        targetPath: event.targetEntity.idxPath
      }
      this.gameRoom.send(playerEvent)
    })
  }

  getAvailableRooms(gameName: string) {
    return new Promise((resolve, reject) => {
      this.client.getAvailableRooms(gameName, (rooms, err) => {
        if (err) {
          reject(err)
        }
        resolve(rooms)
      })
    })
  }

  send(event: ClientPlayerEvent) {
    this.gameRoom.send(event)
  }

  destroy() {
    this.client.close()

    if (this.app) {
      this.app.destroy()
      this.app = null
    }

    if (this.gameRoom) {
      this.gameRoom.destroy()
      this.gameRoom = null
    }
  }

  static events = {
    clientOpen: Symbol("clientOpen"),
    clientClose: Symbol("clientClose")
    // clientOpen: Symbol("clientOpen")
  }
}
