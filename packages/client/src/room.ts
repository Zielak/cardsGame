import { Room as colyseusRoom } from "colyseus.js/lib/Room"
import { EventEmitter } from "eventemitter3"
import { logs } from "@cardsgame/utils"

export class Room extends EventEmitter {
  childrenListeners = []

  constructor(public room: colyseusRoom) {
    super()

    room.onMessage((message: ServerMessage) => {
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
    room.onStateChange(state => {
      logs.notice("ROOM, state been updated:", state)
      this.emit(Room.events.stateChange, state)
    })
    room.onLeave(data => {
      logs.notice("client left the room", data)
      this.emit(Room.events.leave, data)
    })
    room.onError(err => {
      logs.error("oops, error ocurred:", err)
      this.emit(Room.events.error, err)
    })

    logs.notice("client joined successfully")
    this.emit(Room.events.join)
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

    this.room.state.players.onAdd = (player, key) => {
      logs.notice("player created", key, player.name)
      this.emit(Room.events.playerAdded, player)
    }
    this.room.state.players.onRemove = (player, key) => {
      logs.notice("player removed", player.name)
      this.emit(Room.events.playerRemoved, player)
    }
  }

  send(message: PlayerEvent) {
    logs.info("Sending:", message)
    this.room.send(message)
  }

  leave() {
    this.room.leave()
  }

  destroy() {
    this.room.removeAllListeners()
    this.room.leave()
  }

  get state() {
    return this.room ? this.room.state : undefined
  }

  get sessionID() {
    return this.room.sessionId
  }

  get id() {
    return this.room.id
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
