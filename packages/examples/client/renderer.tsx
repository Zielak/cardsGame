// TODO: This is PIXI thing, remove it

import * as pixi from "pixi.js"
import React, {
  FunctionComponent,
  useState,
  useEffect,
  useReducer
} from "react"
import {
  Room,
  Game,
  PlayerData,
  logs,
  EntityData,
  ClientEntityData
} from "@cardsgame/client"

import { EntityView } from "./entities/entityView"
import { PlayerView } from "./entities/playerView"
import { entityFactory } from "./entities/factory"
import { EntityEvents } from "@cardsgame/utils"

const VIEW_WIDTH = 600
const VIEW_HEIGHT = 600

export interface ClickEvent {
  targetEntity: EntityView
  type: string
}

interface RendererProps {
  gameRef: Game
  roomRef: Room
  viewWidth?: number
  viewHeight?: number
}

function arrayReducer(state, action) {
  switch (action.type) {
    case "push":
      return state.push(action.value)
    case "replace":
      return state.push(action.value)
    case "remove":
      return state.filter(action.value)
    case "filterOut":
      return state.filter(action.filter)
    default:
      throw new Error()
  }
}
function mapReducer<K, V>(state: Map<K, V>, action): Map<K, V> {
  switch (action.type) {
    case "set":
      return (state as Map<any, any>).set(action.key, action.value)
    case "delete":
      ;(state as Map<any, any>).delete(action.key)
      return state
    default:
      throw new Error()
  }
}

type ClientPlayerData = {
  clientID: string
  entityData: EntityData
  playerEntity: PlayerView
}

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

export const Renderer: FunctionComponent<RendererProps> = props => {
  const [pixiApp, setPixiApp] = useState<pixi.Application>(undefined)
  const [lowerFps, setLowerFps] = useState(undefined)

  useEffect(() => {
    if (!props.roomRef) return

    const createPixi = () => {
      setPixiApp(
        new pixi.Application(
          props.viewWidth || VIEW_WIDTH,
          props.viewHeight || VIEW_HEIGHT,
          {
            antialias: true,
            backgroundColor: 0x1099bb,
            resolution: window.devicePixelRatio,
            autoResize: true
          }
        )
      )
      setLowerFps(
        (() => {
          pixiApp.ticker.stop()
          let lastTime = performance.now()
          return setInterval(() => {
            if (!pixiApp || !pixiApp.ticker) {
              clearInterval(lowerFps)
              return
            }
            const now = performance.now()
            pixiApp.ticker.update(now - lastTime)
            lastTime = performance.now()
          }, 1000 / 12)
        })()
      )

      document.getElementById("renderer").appendChild(pixiApp.view)

      pixiApp.stage.x = props.viewWidth / 2
      pixiApp.stage.y = props.viewHeight / 2

      pixiApp.stage.interactive = true

      pixiApp.stage.on("click", (event: pixi.interaction.InteractionEvent) => {
        const targetEntity = event.target as EntityView
        logs.info("Table got clicked", targetEntity)

        props.gameRef.emit("click", {
          targetEntity,
          type: event.type
        })
      })
    }

    createPixi()

    return () => {
      logs.error("RENDERER", "destroy for some reason?")
      pixiApp.destroy()
      document.getElementById("renderer").innerHTML = ""
    }
  }, ["roomRef"])

  const [playersData, newPlayersData] = useReducer(
    mapReducer,
    new Map<number, ClientPlayerData>()
  )

  useEffect(() => {
    if (!props.roomRef) return
    const room = props.roomRef

    /**
     * Move players around to form a circle, with you at the bottom
     * TODO: Think of applying different strategies to render players around
     * Poker table, team-based games, mobile view?
     */
    const updatePlayersView = () => {
      // Find out which player am I.
      let players = Array.from(playersData.values())
      let currentPlayerIdx = players.findIndex(
        (pd: ClientPlayerData) => pd.clientID === props.gameRef.client.id
      )
      if (currentPlayerIdx < 0) {
        currentPlayerIdx = 0
      }
      players = [
        players[currentPlayerIdx],
        ...players.slice(currentPlayerIdx + 1),
        ...players.slice(0, currentPlayerIdx)
      ]

      players.forEach((pd: ClientPlayerData, idx, all) => {
        const angle = ((Math.PI * 2) / all.length) * idx
        const point = {
          x: Math.sin(-angle) * (this.viewWidth * 0.4),
          y: Math.cos(-angle) * (this.viewHeight * 0.4)
        }

        const playerEntity = playersData.get(pd.clientID) as PlayerView
        playerEntity.rotation = angle
        playerEntity.x = point.x
        playerEntity.y = point.y
      })
    }

    const onPlayerAdded = (data: PlayerData) => {
      const playerEntityView = getEntity([data.entityData.idx]) as PlayerView
      newPlayersData({
        type: "set",
        key: data.clientID,
        value: playerEntityView
      })
      updatePlayersView()
    }
    const onPlayerRemoved = (data: PlayerData) => {
      newPlayersData({ type: "delete", key: data.clientID })
      updatePlayersView()
    }
    const onChildAdded = change => {
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
      logs.verbose(
        `> child.added ${change.value.type} [${change.rawPath.join("/")}]`
      )
      // logs.verbose('entity:', change.value)
    }
    const onChildRemoved = change => {
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

      logs.verbose(`> child.removed[${change.rawPath.join("/")}]`)
      // logs.verbose('entity:', change.value)
    }

    const attributeChange = change => {
      logs.info(`attributeChange`, change)
      // getEntity(change.rawPath).emit("attributeChanged", {
      //   name: change.path.attribute,
      //   value: change.value
      // })
    }

    room.on(Room.events.playerAdded, onPlayerAdded)
    room.on(Room.events.playerRemoved, onPlayerRemoved)
    room.on(EntityEvents.childAdded, onChildAdded)
    room.on(EntityEvents.childRemoved, onChildRemoved)

    const onAdd = (entity: EntityData, key: number) => {
      entity.onChange = attributeChange
      entity.children.onAdd = onAdd
      entity.children.onRemove = onRemove
    }
    const onRemove = (entity: EntityData, key: number) => {
      entity.children.onAdd = onAdd
      entity.children.onRemove = onRemove
    }
    publicAttributes.forEach(propName => {
      room.state.entities[0].children.onAdd = onAdd
      room.on(
        `child.attribute.${propName}`,
        this.app.attributeChange.bind(this.app)
      )
    })

    return () => {}
  }, [])

  /**
   * Travels along the path (list of ID's) to get that last target EntityView
   */
  const getEntity = (path: any[]): EntityView => {
    const travel = (path: number[], currentObject: EntityView) => {
      const currentIndex = path.shift()

      // Get to the object of this ID inside `currentObject`
      const foundChild = currentObject.children.find((child: EntityView) => {
        return child.idx === currentIndex
      }) as EntityView

      if (!foundChild) {
        // This probably shouldn't always be an ERROR
        // Game runs fine after this happens (makao -> playing multiple cards)
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

    return travel(pathOfIDs, pixiApp.stage as EntityView)
  }

  return <div id="renderer" />
}
