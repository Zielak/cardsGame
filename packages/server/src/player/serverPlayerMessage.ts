import type { Player } from "./player.js"

// Event from client, with stuff auto filled when coming to server
export type ServerPlayerMessage = ClientPlayerMessage & {
  /**
   * Player who initiated interaction on client-side
   */
  player?: Player
  /**
   * An Entity which was interacted with
   */
  entity?: unknown
  /**
   * List of all interactable parents, starting with target entity, finishing with the most distant parent
   */
  entities?: unknown[]
  /**
   * During `dragStart`/`dragEnd` happening, this is the entity related to `dragStart` event.
   *
   * Populated only during drag events. With `tap` fallback events, refer to player's `dragStartEntity`.
   *
   * @deprecated with tap fallback I would have to modify a message on the fly... Lets use Player's prop instead
   */
  draggedEntity?: unknown
  /**
   * It's the time when the message has arrived to the server
   */
  timestamp: number
}
