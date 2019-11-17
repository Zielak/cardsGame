import { Room as colyseusRoom } from "colyseus.js/lib/Room"
import { logs } from "@cardsgame/utils"

export class Room {
  childrenListeners = []

  constructor(public room: colyseusRoom) {
    room.onMessage((message: ServerMessage) => {
      if (message.type && message.data) {
        switch (message.type) {
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
      this.onMessage(message)
    })
    room.onStateChange(state => {
      logs.notice("ROOM, state been updated:", state)
      this.onStateChange(state)
    })
    room.onLeave(code => {
      logs.notice("client left the room", code)
      this.onLeave(code)
    })
    room.onError(message => {
      logs.error("oops, error ocurred:", message)
      this.onError(message)
    })

    logs.notice("client joined successfully")
  }

  gameStateListeners(state) {
    this.room.state.clients.onAdd = (client, key) => {
      logs.verbose("new client joined", client)
    }
    this.room.state.clients.onRemove = (client, key) => {
      logs.verbose("client left", client)
    }

    this.room.state.players.onAdd = (player, key) => {
      logs.verbose("player created", key, player.name)
    }
    this.room.state.players.onRemove = (player, key) => {
      logs.verbose("player removed", player.name)
    }
  }

  onMessage(message: ServerMessage) {}
  onStateChange(state) {}
  /**
   * @param {number} code webSocket shutdown code
   */
  onLeave(code) {}
  onError(message) {}

  /**
   * Send a message from client to server.
   * @param {ClientPlayerEvent} message
   */
  send(message: ClientPlayerEvent) {
    logs.verbose("Sending:", JSON.stringify(message))
    this.room.send(message)
  }

  /**
   * Sends en event related to entity interaction.
   *
   * @param {MouseEvent | TouchEvent} event mouse or touch event. `event.type` will be grabbed from it automatically.
   * @param {number[] entityIdxPath
   */
  sendInteraction(event: MouseEvent | TouchEvent, entityIdxPath: number[]) {
    const playerEvent: ClientPlayerEvent = {
      command: "EntityInteraction",
      event: event.type,
      entityPath: entityIdxPath
    }
    this.room.send(playerEvent)
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

  // TODO:
  /** @deprecate */
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
