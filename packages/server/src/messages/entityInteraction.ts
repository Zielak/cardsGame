import { logs } from "@cardsgame/utils"

import { ENTITY_INTERACTION } from "../interaction/types.js"
import type { Room } from "../room/base.js"
import type { State } from "../state/state.js"
import type { ChildTrait } from "../traits/index.js"
import { populatePlayerEvent } from "../utils/populatePlayerEvent.js"

/**
 * This function will only be called when `messageType === ENTITY_INTERACTION`
 *
 * @param this
 * @param client
 * @param message
 * @ignore
 */
export async function entityInteraction(
  this: Room<State>,
  client,
  message: RawInteractionClientPlayerMessage
): Promise<void> {
  const newMessage = populatePlayerEvent(
    this.state,
    { ...message, messageType: ENTITY_INTERACTION },
    client.sessionId
  )
  const { player, interaction } = newMessage

  // Plan it now, because dragAction might change state of isTapDragging
  const planTapDragCleanup =
    player &&
    (interaction === "dragend" ||
      (interaction === "tap" && player.isTapDragging))

  if (player) {
    // Will be repeated in DragAction on "tap" events, if present in this game.
    if (interaction === "dragstart") {
      player.dragStartEntity = newMessage.entity as ChildTrait
    }
  }

  try {
    await this.handleMessage(newMessage)
  } catch (e) {
    logs.error(
      "ROOM",
      `EntityInteraction failed for client: "${client.sessionId}": ${e}`
    )
  }

  if (planTapDragCleanup) {
    player.dragStartEntity = undefined
    player.isTapDragging = false
  }
}
