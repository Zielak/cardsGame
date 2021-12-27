import { logs } from "@cardsgame/utils"

import type { Room } from "../room"
import type { State } from "../state"
import { populatePlayerEvent } from "../utils/populatePlayerEvent"

export function fallback(
  this: Room<State>,
  client,
  messageType: string,
  message: any
): void {
  const newMessage = populatePlayerEvent(
    this.state,
    { data: message, messageType },
    client.sessionId
  )
  this.handleMessage(newMessage).catch((e) =>
    logs.error(
      "ROOM",
      `message type "${messageType}" failed for client: "${client.sessionId}": ${e}`
    )
  )
}
