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
   */
  draggedEntity?: unknown
  /**
   * It's the time when the message has arrived to the server
   */
  timestamp: number
}
