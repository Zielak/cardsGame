import * as pixi from "pixi.js"
import { EventEmitter } from "eventemitter3"
import { EntityView } from "./entities/entityView"
import { logs } from "./logs"

interface AppOptions {
  viewElement: HTMLElement
  viewWidth: number
  viewHeight: number
}

export class App extends EventEmitter {
  pixiApp: pixi.Application
  viewElement: HTMLElement
  viewWidth: number
  viewHeight: number

  constructor({ viewElement, viewWidth, viewHeight }: AppOptions) {
    super()

    this.viewElement = viewElement
    this.viewWidth = viewWidth
    this.viewHeight = viewHeight
  }

  create() {
    this.pixiApp = new pixi.Application(this.viewWidth, this.viewHeight, {
      antialias: true,
      backgroundColor: 0x1099bb,
      resolution: window.devicePixelRatio,
      autoResize: true
    })
    this.viewElement.appendChild(this.pixiApp.view)

    // Offset the stage, so (0,0) is in the middle of screen
    this.pixiApp.stage.x = this.viewWidth / 2
    this.pixiApp.stage.y = this.viewHeight / 2

    this.pixiApp.stage.interactive = true

    // Pass interaction up to the "Game"
    this.pixiApp.stage.on("click", (event: pixi.interaction.InteractionEvent) =>
      this.emit("click", event)
    )
  }

  setLowerFPS() {
    const lowerFps = (() => {
      if (!this.pixiApp) return
      this.pixiApp.ticker.stop()
      let lastTime = performance.now()
      return setInterval(() => {
        if (!this.pixiApp) {
          clearInterval(lowerFps)
          return
        }
        const now = performance.now()
        this.pixiApp.ticker.update(now - lastTime)
        lastTime = performance.now()
      }, 1000 / 10)
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

  addChild(entity: EntityView) {
    this.pixiApp.stage.addChild(entity)
  }

  destroy() {
    this.pixiApp.destroy()
    this.viewElement.parentElement.removeChild(this.viewElement)
    this.viewElement = undefined
  }
}
