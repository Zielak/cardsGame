import * as colyseus from "colyseus.js"
import * as pixi from "pixi.js"
import { GamesList } from "./components/gamesList"
import { Room } from "./room"
import { logs } from "./logs"
import { entityFactory } from "./entities/factory"
import { EntityView } from "./entities/entityView"
import { EntityEvents } from "../shared/events"
import * as ReactDOM from "react-dom"
import * as React from "react"

const VIEW_WIDTH = 600
const VIEW_HEIGHT = 600

/**
 * Renderer
 * Get events from the game and put everything on the screen.
 * Provide an interface for the players: play area, settings and others
 */
export class App {
  client: colyseus.Client
  app: pixi.Application
  gameRoom: Room

  gameNames = ["Makao", "ContainersTest"]

  listAllRoomsInterval: NodeJS.Timeout

  constructor() {
    const host = window.document.location.hostname
    const port = window.document.location.port ? ":" + 2657 : ""
    this.client = new colyseus.Client("ws://" + host + port)

    this.client.onOpen.add(() => {
      logs.info("CLIENT open")

      // Create renderer
      this.app = new pixi.Application(VIEW_WIDTH, VIEW_HEIGHT, {
        antialias: true,
        backgroundColor: 0x1099bb,
        resolution: window.devicePixelRatio,
        autoResize: true
      })
      window["view"].appendChild(this.app.view)

      // Offset the stage, so (0,0) is in the middle of screen
      this.app.stage.x = VIEW_WIDTH / 2
      this.app.stage.y = VIEW_HEIGHT / 2

      const lowerFps = (() => {
        if (!this.app) return
        this.app.ticker.stop()
        let lastTime = performance.now()
        return setInterval(() => {
          if (!this.app) {
            clearInterval(lowerFps)
            return
          }
          const now = performance.now()
          this.app.ticker.update(now - lastTime)
          lastTime = performance.now()
        }, 1000 / 10)
      })()

      this.prepareUserInterface()
    })

    this.client.onClose.add(() => this.destroy())

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
        const entity = this.getEntity(change.rawPath)
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
        const parent = this.getEntity(change.rawPath.slice(2, -2))
        parent.addChild(newEntity)
        parent.emit(EntityEvents.childAdded, change)
      } else {
        this.app.stage.addChild(newEntity)
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
          this.getEntity(change.rawPath).emit("attributeChanged", {
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
          this.getEntity(change.rawPath).emit("attributeChanged", {
            name: change.path.attribute,
            value: change.value
          })
        }
      )
    })

    // -------

    this.app.stage.interactive = true
    this.app.stage.on("click", (event: pixi.interaction.InteractionEvent) => {
      const targetEntity = event.target as EntityView
      logs.info("Table got clicked", targetEntity)

      const playerEvent: PlayerEvent = {
        type: event.type,
        targetPath: targetEntity.idxPath
        // additional/optional data
        // data?: any
      }
      this.gameRoom.send(playerEvent)
    })
  }

  // React things
  prepareUserInterface() {
    const element = (
      <GamesList
        joinRoom={gameName => this.joinRoom(gameName)}
        gameNames={this.gameNames}
        getAvailableRooms={this.client.getAvailableRooms.bind(this.client)}
      />
    )
    ReactDOM.render(element, document.getElementById("gamesList"))
  }

  joinRoom(gameName: string) {
    const gameRoom = this.client.join(gameName)
    window["gameRoom"] = this.gameRoom = new Room(gameRoom)
    this.prepareRenderingApp()
  }

  /**
   * Travels along the path (list of ID's) to get that last target EntityView
   */
  getEntity(path: any[]): EntityView {
    const travel = (path: number[], currentObject: EntityView) => {
      const currentIndex = path.shift()

      // Get to the object of this ID inside `currentObject`
      const foundChild = currentObject.children.find((child: EntityView) => {
        return child.idx === currentIndex
      }) as EntityView

      if (!foundChild) {
        logs.error("getEntity", `Whoops, this guy didn't have that child`)
      }
      if (path.length === 0) {
        // we're done, thats the end of line
        return foundChild
      }
      if (!foundChild.children) {
        throw new Error(
          `Whoops, I'm not finished, but this guy didn't have children ?? `
        )
      } else {
        return travel(path, foundChild)
      }
    }

    // Sanitize, all indexes must be in numbers
    const pathOfIDs: number[] = path.reduce((arr, value) => {
      if (Number.isNaN(parseInt(value))) {
        return arr
      }
      arr.push(parseInt(value))
      return arr
    }, [])

    return travel(pathOfIDs, this.app.stage as EntityView)
  }

  destroy() {
    this.client.close()

    if (this.app) {
      this.app.destroy()
      this.app = null
    }
    window["view"].innerHTML = ""

    delete window["gameRoom"]
    if (this.gameRoom) {
      this.gameRoom.destroy()
      this.gameRoom = null
    }
  }
}
