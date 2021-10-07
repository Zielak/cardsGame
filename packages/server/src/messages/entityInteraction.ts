import { logs } from "@cardsgame/utils"

import { Room } from "../room"
import { State } from "../state"
import { populatePlayerEvent } from "../utils"

export function entityInteraction(
  this: Room<State>,
  client,
  message: RawInteractionClientPlayerMessage
): void {
  const newMessage = populatePlayerEvent(
    this.state,
    { ...message, messageType: "EntityInteraction" },
    client.sessionId
  )
  this.handleMessage(newMessage).catch((e) =>
    logs.error(
      "ROOM",
      `EntityInteraction failed for client: "${client.sessionId}": ${e}`
    )
  )
}
