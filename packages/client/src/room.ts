import * as colyseus from "colyseus.js"
import { EventEmitter } from "eventemitter3"
import { logs } from "./logs"
import { EntityEvents } from "../shared/events"

export class Room extends EventEmitter {
  childrenListeners = []
  stateView: HTMLElement

  constructor(private room: colyseus.Room) {
    super()

    this.stateView = document.getElementById("stateView")

    room.onStateChange.addOnce(state => {
      logs.notice("ROOM, this is the first room state!", state)
    })
    room.onStateChange.add(state => {
      logs.notice("ROOM, state been updated:", state)
      function replacer(key, value) {
        if (key === "") {
          return value
        }
        // Filtering out properties
        if (typeof value === "object") {
          return undefined
        }
        return value
      }
      this.stateView.innerHTML = JSON.stringify(state, replacer, "  ")
    })
    room.onMessage.add(message => {
      if (message.event && message.data) {
        switch (message.event) {
          case "game.info":
            logs.info("Server:", message.data)
            break
          case "game.warn":
            logs.warn("Server:", message.data)
            break
          case "game.error":
            logs.error("Server:", message.data)
            break
          case EntityEvents.privateAttributeChange:
            room.onStateChange.addOnce(() => {
              logs.verbose(
                `after state update -> privateAttributeUpdate`,
                message.data
              )
              this.updatePrivateAttribute(message.data)
            })
            break
        }
      } else {
        // Any other silly type of message:
        logs.verbose("server just sent this message:", message)
      }
    })
    room.onJoin.add(() => {
      logs.notice("client joined successfully")
    })
    room.onLeave.add(() => {
      logs.notice("client left the room")
    })
    room.onError.add(err => {
      logs.error("oops, error ocurred:", err)
    })

    this.gameStateListeners()
    this.entitiesListeners()
  }

  gameStateListeners() {
    this.room.listen("players/:idx", (change: colyseus.DataChange) => {
      if (change.operation === "add") {
        logs.notice("new player added to the state")
        logs.verbose("player id:", change.path.idx)
        logs.verbose("player data:", change.value)
      } else if (change.operation === "remove") {
        logs.notice("player has been removed from the state")
        logs.verbose("player id:", change.path.idx)
      }
    })
  }

  // TODO: What the fuck is this?
  entitiesListeners() {
    const addListeners = path => {
      this.room.listen(path, this.childrenHandler.bind(this))
      this.room.listen(
        path + "/:attribute",
        this.attributeChangeHandler.bind(this)
      )
    }
    let path = "entities/children/:idx"
    addListeners(path)

    path += "/children/:idx"
    addListeners(path)

    path += "/children/:idx"
    addListeners(path)

    path += "/children/:idx"
    addListeners(path)
  }

  childrenHandler(change: colyseus.DataChange) {
    if (change.operation === "add") {
      this.emit(EntityEvents.childAdded, change)
    } else if (change.operation === "remove") {
      this.emit(EntityEvents.childRemoved, change)
    } else {
      logs.error("Woah, you forgot about something")
    }
  }

  attributeChangeHandler(change: colyseus.DataChange) {
    // log.verbose(`[${change.path.idx}] child.attribute.${change.path['attribute']}:`, change)
    this.emit("child.attribute." + change.path["attribute"], change)
  }

  updatePrivateAttribute(data: PrivateAttributeChangeData) {
    this.emit(`visibility.${data.attribute}`, {
      rawPath: data.path,
      path: {
        attribute: data.attribute
      },
      value: data.value
    })
  }

  send(message: any) {
    logs.info("Sending:", message)
    this.room.send(message)
  }

  destroy() {
    this.room.removeAllListeners()
    this.room.leave()
  }
}
