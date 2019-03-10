import * as colyseus from "colyseus.js"
import * as pixi from "pixi.js"
import { EventEmitter } from "eventemitter3"
import { EntityEvents, rad2deg } from "@cardsgame/utils"
import { EntityView } from "./entities/entityView"
import { logs } from "./logs"
import { PlayerView } from "./entities/playerView"
import { ClientEntityData } from "./types"
import { entityFactory } from "./entities/factory"
import { PlayerData, Room } from "./room"

interface AppOptions {
  viewElement: HTMLElement
  viewWidth: number
  viewHeight: number
  clientID: string
}

export interface ClickEvent {
  targetEntity: EntityView
  type: string
}

export class App extends EventEmitter {
  pixiApp: pixi.Application
  viewElement: HTMLElement
  viewWidth: number
  viewHeight: number

  clientID: string
  playersData: PlayerData[] = []
  clientEntity = new Map<string, PlayerView>()

  _lowerFps: number | NodeJS.Timeout

  constructor({ viewElement, viewWidth, viewHeight, clientID }: AppOptions) {
    super()

    this.viewElement = viewElement
    this.viewWidth = viewWidth
    this.viewHeight = viewHeight
    this.clientID = clientID

    this.on(Room.events.playerAdded, this.onPlayerAdded.bind(this))
    this.on(Room.events.playerRemoved, this.onPlayerRemoved.bind(this))
  }

  create() {
    this.pixiApp = new pixi.Application(this.viewWidth, this.viewHeight, {
      antialias: true,
      backgroundColor: 0x1099bb,
      resolution: window.devicePixelRatio,
      autoResize: true
    })
    this.setLowerFPS()
    this.viewElement.appendChild(this.pixiApp.view)

    // Offset the stage, so (0,0) is in the middle of screen
    this.pixiApp.stage.x = this.viewWidth / 2
    this.pixiApp.stage.y = this.viewHeight / 2

    this.pixiApp.stage.interactive = true

    // Pass interaction up to the "Game"
    this.pixiApp.stage.on(
      "click",
      (event: pixi.interaction.InteractionEvent) => {
        const targetEntity = event.target as EntityView
        logs.info("Table got clicked", targetEntity)

        this.emit("click", {
          targetEntity,
          type: event.type
        })
      }
    )
  }

  setLowerFPS() {
    this._lowerFps = (() => {
      if (!this.pixiApp) return
      this.pixiApp.ticker.stop()
      let lastTime = performance.now()
      return setInterval(() => {
        if (!this.pixiApp || !this.pixiApp.ticker) {
          clearInterval(this._lowerFps as NodeJS.Timeout)
          return
        }
        const now = performance.now()
        this.pixiApp.ticker.update(now - lastTime)
        lastTime = performance.now()
      }, 1000 / 12)
    })()
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

    return travel(pathOfIDs, this.pixiApp.stage as EntityView)
  }

  removeChild(change: colyseus.DataChange) {
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

  addChild(change: colyseus.DataChange) {
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
      // It's path is long, meaning it has non-top level parent
      const parent = this.getEntity(change.rawPath.slice(2, -2))
      parent.addChild(newEntity)
      parent.emit(EntityEvents.childAdded, change)
    } else {
      // It's top-level entity
      this.pixiApp.stage.addChild(newEntity)
    }
    logs.notice(
      `> child.added ${change.value.type} [${change.rawPath.join("/")}]`
    )
    // logs.verbose('entity:', change.value)
  }

  attributeChange(change: colyseus.DataChange) {
    this.getEntity(change.rawPath).emit("attributeChanged", {
      name: change.path.attribute,
      value: change.value
    })
  }

  visibilityChange(change: colyseus.DataChange) {
    this.getEntity(change.rawPath).emit("attributeChanged", {
      name: change.path.attribute,
      value: change.value
    })
  }

  onPlayerAdded(data: PlayerData) {
    this.playersData.push(data)
    const playerEntity = this.getEntity([data.entity.idx]) as PlayerView
    this.clientEntity.set(data.clientID, playerEntity)
    this.updatePlayersView()
  }
  onPlayerRemoved(data: PlayerData) {
    this.playersData = this.playersData.filter(
      pd => pd.clientID !== data.clientID
    )
    this.clientEntity.delete(data.clientID)
    this.updatePlayersView()
  }

  /**
   * Move players around to form a circle, with you at the bottom
   * TODO: Think of applying different strategies to render players around
   * Poker table, team-based games, mobile view?
   */
  updatePlayersView() {
    // Find out which player am I.
    let currentPlayerIdx = this.playersData.findIndex(
      pd => pd.clientID === this.clientID
    )
    if (currentPlayerIdx < 0) {
      currentPlayerIdx = 0
    }
    const players = [
      this.playersData[currentPlayerIdx],
      ...this.playersData.slice(currentPlayerIdx + 1),
      ...this.playersData.slice(0, currentPlayerIdx)
    ]

    players.forEach((pd, idx, all) => {
      const angle = ((Math.PI * 2) / all.length) * idx
      const point = {
        x: Math.sin(-angle) * (this.viewWidth * 0.4),
        y: Math.cos(-angle) * (this.viewHeight * 0.4)
      }

      const playerEntity = this.clientEntity.get(pd.clientID)
      playerEntity.rotation = angle
      playerEntity.x = point.x
      playerEntity.y = point.y

      logs.warn(`player ${idx}.${pd.clientID}:`, angle, point)
    })
  }

  destroy() {
    this.pixiApp.destroy()
    this.viewElement.parentElement.removeChild(this.viewElement)
    this.viewElement = undefined
  }
}
