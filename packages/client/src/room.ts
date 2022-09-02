import { logs } from "@cardsgame/utils"
import type { Room as colyseusRoom } from "colyseus.js/lib/Room"

import type { ClientGameState } from "./schema/types"

export class Room<
  StateProps = Record<string, any>,
  MoreMessageTypes extends Record<string, unknown> = Record<string, unknown>
> {
  constructor(public room: colyseusRoom) {
    room.onMessage<ServerMessageTypes["gameInfo"]>("gameInfo", (message) => {
      logs.info("Server:", message)
    })
    room.onMessage<ServerMessageTypes["gameWarn"]>("gameWarn", (message) => {
      logs.warn("Server:", message)
    })
    room.onMessage<ServerMessageTypes["gameError"]>("gameError", (message) => {
      logs.error("Server:", message)
    })

    room.onMessage<ServerMessage>("*", (message) => {
      logs.debug("? Server:", message)
    })

    room.onStateChange.once((state) => {
      logs.log("ROOM, state initiated:", state)
      this.onFirstStateChange(state)
    })
    room.onStateChange((state) => {
      logs.log("ROOM, state updated:", state)
      this.onStateChange(state)
    })
    room.onLeave((code) => {
      logs.log("client left the room", code)
      this.onLeave(code)
    })
    room.onError((code, message) => {
      logs.error(`oops, error ocurred: [${code}]`, message)
      this.onError(code, message)
    })

    logs.log("client joined successfully")
  }

  /**
   * Subscribe to messages from the server
   * @return method to unsubscribe
   */
  onMessage<
    M extends RecordOfServerMessages<MoreMessageTypes & { "*": unknown }> &
      ServerMessageTypes,
    T extends keyof M
  >(type: T, callback: (message: M[T]) => void): () => void {
    return this.room.onMessage<M[T]>(type as string, callback)
  }

  /**
   * @override
   */
  onStateChange(state: ClientGameState<StateProps>): void {}
  /**
   * @override
   */
  onFirstStateChange(state: ClientGameState<StateProps>): void {}
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
   */
  send(type: string, message?: ClientPlayerMessage): void {
    logs.debug("Sending:", type, JSON.stringify(message))
    this.room.send(type, message)
  }

  /**
   * Sends an event related to entity interaction.
   *
   * @param {MouseEvent | TouchEvent} eventType exact type of mouse or touch event.
   * @param {number[]} entityIdxPath
   */
  sendInteraction(
    eventType: (MouseEvent | TouchEvent)["type"],
    entityIdxPath: number[],
    data = undefined
  ): void {
    logs.debug(
      "Sending Interaction:",
      eventType,
      "entityIdxPath:",
      entityIdxPath
    )
    const playerEvent: RawInteractionClientPlayerMessage = {
      event: eventType,
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

  get state(): ClientGameState<StateProps> {
    return this.room ? this.room.state : undefined
  }

  get sessionID(): string {
    return this.room.sessionId
  }

  get id(): string {
    return this.room.id
  }
}
