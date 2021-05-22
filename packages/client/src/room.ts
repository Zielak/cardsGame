import { logs } from "@cardsgame/utils"
import { Room as colyseusRoom } from "colyseus.js/lib/Room"

import type { ClientGameState } from "./schema"

export class Room {
  constructor(public room: colyseusRoom) {
    room.onMessage<ServerMessage>("game.info", (message) => {
      logs.info("Server:", message)
    })
    room.onMessage<ServerMessage>("game.warn", (message) => {
      logs.warn("Server:", message)
    })
    room.onMessage<ServerMessage>("game.error", (message) => {
      logs.error("Server:", message)
    })

    room.onMessage<ServerMessage>("*", (message) => {
      logs.verbose("? Server:", message)
    })

    room.onStateChange.once((state) => {
      logs.notice("ROOM, state initiated:", state)
      this.onFirstStateChange(state)
    })
    room.onStateChange((state) => {
      logs.notice("ROOM, state updated:", state)
      this.onStateChange(state)
    })
    room.onLeave((code) => {
      logs.notice("client left the room", code)
      this.onLeave(code)
    })
    room.onError((code, message) => {
      logs.error(`oops, error ocurred: [${code}]`, message)
      this.onError(code, message)
    })

    logs.notice("client joined successfully")
  }

  /**
   * Subscribe to messages from the server
   * @return method to unsubscribe
   */
  onMessage<T = ServerMessage>(
    type: string,
    callback: (message: T) => void
  ): () => void {
    return this.room.onMessage<T>(type, callback)
  }

  /**
   * @override
   */
  onStateChange(state: ClientGameState): void {}
  /**
   * @override
   */
  onFirstStateChange(state: ClientGameState): void {}
  /**
   * @override
   * @param {number} code webSocket shutdown code
   */
  onLeave(code: number): void {}
  /**
   * @override
   */
  onError(code: number, message: string): void {}

  /**
   * Send a custom message from client to server.
   * @param {ClientPlayerMessage} message
   */
  send(type: string, message = undefined): void {
    logs.verbose("Sending:", type, JSON.stringify(message))
    this.room.send(type, message)
  }

  /**
   * Sends an event related to entity interaction.
   *
   * @param {MouseEvent | TouchEvent} event mouse or touch event. `event.type` will be grabbed from it automatically.
   * @param {number[] entityIdxPath
   */
  sendInteraction(
    event: MouseEvent | TouchEvent,
    entityIdxPath: number[],
    data = undefined
  ): void {
    logs.verbose(
      "Sending Interaction:",
      event.type,
      "entityIdxPath:",
      entityIdxPath
    )
    const playerEvent: RawInteractionClientPlayerMessage = {
      event: event.type,
      entityPath: entityIdxPath,
    }
    if (data) {
      playerEvent.data = data
    }
    this.room.send("EntityInteraction", playerEvent)
  }

  leave(): void {
    this.room.leave()
  }

  destroy(): void {
    this.room.removeAllListeners()
    this.room.leave()
  }

  get state(): ClientGameState {
    return this.room ? this.room.state : undefined
  }

  get sessionID(): string {
    return this.room.sessionId
  }

  get id(): string {
    return this.room.id
  }
}
