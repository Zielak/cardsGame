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
    room.onStateChange((state) => {
      logs.notice("ROOM, state been updated:", state)
      this.onStateChange(state)
    })
    room.onLeave((code) => {
      logs.notice("client left the room", code)
      this.onLeave(code)
    })
    room.onError((message) => {
      logs.error("oops, error ocurred:", message)
      this.onError(message)
    })

    logs.notice("client joined successfully")
  }

  onMessage(message: ServerMessage): void {}
  onStateChange(state: any): void {}
  /**
   * @param {number} code webSocket shutdown code
   */
  onLeave(code: number): void {}
  onError(message: string): void {}

  /**
   * Send a message from client to server.
   * @param {ClientPlayerEvent} message
   */
  send(message: ClientPlayerEvent): void {
    logs.verbose("Sending:", JSON.stringify(message))
    this.room.send(message)
  }

  /**
   * Sends en event related to entity interaction.
   *
   * @param {MouseEvent | TouchEvent} event mouse or touch event. `event.type` will be grabbed from it automatically.
   * @param {number[] entityIdxPath
   */
  sendInteraction(
    event: MouseEvent | TouchEvent,
    entityIdxPath: number[],
    data?: Record<string, any>
  ): void {
    const playerEvent: ClientPlayerEvent = {
      command: "EntityInteraction",
      event: event.type,
      entityPath: entityIdxPath,
    }
    if (data) {
      playerEvent.data = data
    }
    this.room.send(playerEvent)
  }

  leave(): void {
    this.room.leave()
  }

  destroy(): void {
    this.room.removeAllListeners()
    this.room.leave()
  }

  get state(): any {
    return this.room ? this.room.state : undefined
  }

  get sessionID(): string {
    return this.room.sessionId
  }

  get id(): string {
    return this.room.id
  }
}
