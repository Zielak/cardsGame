import * as colyseus from "colyseus.js"
import { EventEmitter } from "eventemitter3"
import { logs } from "./logs"
import { EntityData } from "./types"

export class Room extends EventEmitter {
  childrenListeners = []

  constructor(private room: colyseus.Room) {
    super()

    room.onMessage.add((message: ServerMessage) => {
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
        }
      } else {
        // Any other silly type of message:
        logs.verbose("server just sent this message:", message)
      }
      this.emit(Room.events.message, message)
    })
    room.onStateChange.add(state => {
      logs.notice("ROOM, state been updated:", state)
      this.emit(Room.events.stateChange, state)

      // state.onChange(changes => {
      //   // this.gameStateListeners()
      //   // this.emit(Room.events.stateChange, state)
      //   changes.forEach(change => {
      //     console.log(change.field)
      //     console.log(change.value)
      //     console.log(change.previousValue)
      //   })
      // })
    })
    room.onJoin.add(() => {
      logs.notice("client joined successfully")
      this.emit(Room.events.join)
    })
    room.onLeave.add(data => {
      logs.notice("client left the room", data)
      this.emit(Room.events.leave, data)
    })
    room.onError.add(err => {
      logs.error("oops, error ocurred:", err)
      this.emit(Room.events.error, err)
    })
  }

  gameStateListeners(state) {
    this.room.state.clients.onAdd = (client, key) => {
      logs.notice("new client joined", client)
      this.emit(Room.events.clientJoined, client)
    }
    this.room.state.clients.onRemove = (client, key) => {
      logs.notice("client left", client)
      this.emit(Room.events.clientLeft, client)
    }

    this.room.state.players.onAdd = (player: EntityData, key) => {
      logs.notice("player created", key, player.name)
      this.emit(Room.events.playerAdded, player)
    }
    this.room.state.players.onRemove = (player: EntityData, key) => {
      logs.notice("player removed", player.name)
      this.emit(Room.events.playerRemoved, player)
    }
  }

  send(message: PlayerEvent) {
    logs.info("Sending:", message)
    this.room.send(message)
  }

  destroy() {
    this.room.removeAllListeners()
    this.room.leave()
  }

  get state() {
    return this.room ? this.room.state : undefined
  }

  static events = {
    stateChange: Symbol("stateChange"),
    message: Symbol("message"),
    join: Symbol("join"),
    leave: Symbol("leave"),
    error: Symbol("error"),
    clientJoined: Symbol("clientJoined"),
    clientLeft: Symbol("clientLeft"),
    playerAdded: Symbol("playerAdded"),
    playerRemoved: Symbol("playerRemoved")
  }
}

export type PlayerData = {
  clientID: string
  entityData: EntityData
}
