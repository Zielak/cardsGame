import { logs } from "@cardsgame/utils"

import { ENTITY_INTERACTION } from "../interaction/types.js"
import type { Room } from "../room/base.js"
import type { State } from "../state/state.js"
import { populatePlayerEvent } from "../utils/populatePlayerEvent.js"

/**
 *
 * @param this
 * @param client
 * @param message
 * @ignore
 */
export function entityInteraction(
  this: Room<State>,
  client,
  message: RawInteractionClientPlayerMessage
): void {
  const newMessage = populatePlayerEvent(
    this.state,
    { ...message, messageType: ENTITY_INTERACTION },
    client.sessionId
  )
  this.handleMessage(newMessage).catch((e) =>
    logs.error(
      "ROOM",
      `EntityInteraction failed for client: "${client.sessionId}": ${e}`
    )
  )
}
