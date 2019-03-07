import * as colyseus from "colyseus.js"
import * as pixi from "pixi.js"
import { EntityEvents } from "@cardsgame/utils"
import { Room } from "./room"
import { logs } from "./logs"
import { entityFactory } from "./entities/factory"
import { EntityView } from "./entities/entityView"
import { ClientEntityData, ClientPlayerEvent } from "./types"
import { EventEmitter } from "eventemitter3"
import { App } from "./app"

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
  app: App
  gameRoom: Room

  gameNames: string[]
  viewElement: HTMLElement

  listAllRoomsInterval: NodeJS.Timeout

  constructor({ gameNames, viewElement }: GameOptions) {
    super()

    this.app = new App({
      viewElement,
      viewWidth: VIEW_WIDTH,
      viewHeight: VIEW_HEIGHT
    })

    this.gameNames = gameNames
    this.viewElement = viewElement

    const host = window.document.location.hostname
    const port = window.document.location.port ? ":" + 2657 : ""
    this.client = new colyseus.Client("ws://" + host + port)

    this.client.onOpen.add(() => {
      logs.info("CLIENT open")

      // Create renderer
      this.app.create()

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

  prepareRenderingApp() {
    this.gameRoom.on(
      EntityEvents.childRemoved,
      (change: colyseus.DataChange) => {
        const entity = this.app.getEntity(change.rawPath)
        if (!entity) {
          logs.error(
            EntityEvents.childRemoved,
            `wat, such entity doesn't exist?`,
            change
          )
        }
        const parent = entity.parent as EntityView
        parent.emit(EntityEvents.childRemoved, change)
        parent.removeChild(entity)
        logs.notice(`> child.removed[${change.rawPath.join("/")}]`)
        // logs.verbose('entity:', change.value)
      }
    )

    this.gameRoom.on(EntityEvents.childAdded, (change: colyseus.DataChange) => {
      const data = change.value as ClientEntityData
      const newEntity = entityFactory(data)
      if (!newEntity) {
        logs.error(
          "entityFactory",
          `Failed to create "${data.type}" entity!`,
          data
        )
      }
      if (change.rawPath.slice(2).length > 1) {
        const parent = this.app.getEntity(change.rawPath.slice(2, -2))
        parent.addChild(newEntity)
        parent.emit(EntityEvents.childAdded, change)
      } else {
        this.app.addChild(newEntity)
      }
      logs.notice(
        `> child.added ${change.value.type} [${change.rawPath.join("/")}]`
      )
      // logs.verbose('entity:', change.value)
    })

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
    const privateAttributes = [
      "visibleToClient",
      "selected",
      "suit",
      "rank",
      "name"
    ]

    publicAttributes.forEach(propName => {
      this.gameRoom.on(
        `child.attribute.${propName}`,
        (change: colyseus.DataChange) => {
          this.app.getEntity(change.rawPath).emit("attributeChanged", {
            name: change.path.attribute,
            value: change.value
          })
        }
      )
    })
    privateAttributes.forEach(propName => {
      this.gameRoom.on(
        `visibility.${propName}`,
        (change: colyseus.DataChange) => {
          logs.verbose(`> visibility.${propName}`, change)
          this.app.getEntity(change.rawPath).emit("attributeChanged", {
            name: change.path.attribute,
            value: change.value
          })
        }
      )
    })

    // -------

    this.app.on("click", (event: pixi.interaction.InteractionEvent) => {
      const targetEntity = event.target as EntityView
      logs.info("Table got clicked", targetEntity)

      const playerEvent: ClientPlayerEvent = {
        type: event.type,
        targetPath: targetEntity.idxPath
      }
      this.gameRoom.send(playerEvent)
    })
  }

  joinRoom(gameName: string) {
    const gameRoom = this.client.join(gameName)
    this.gameRoom = new Room(gameRoom)
    this.prepareRenderingApp()
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
