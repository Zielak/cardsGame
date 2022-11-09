import { logs } from "@cardsgame/utils"

import type { Room } from "../room/base.js"
import type { State } from "../state/state.js"
import { populatePlayerEvent } from "../utils/populatePlayerEvent.js"

/**
 *
 * @param this
 * @param client
 * @param messageType
 * @param messageData
 * @ignore
 */
export function fallback(
  this: Room<State>,
  client,
  messageType: string,
  messageData: any
): void {
  const newMessage = populatePlayerEvent(
    this.state,
    { data: messageData, messageType },
    client.sessionId
  )
  this.handleMessage(newMessage).catch((e) =>
    logs.error(
      "ROOM",
      `message type "${messageType}" failed for client: "${client.sessionId}": ${e}`
    )
  )
}
