import type { Client } from "@colyseus/core"

import type { Room } from "@/room/base.js"
import type { State } from "@/state/state.js"

/**
 * @ignore
 */
export function ready(
  this: Room<State>,
  client: Client,
  message: ClientMessageTypes["ready"],
): void {
  const { state } = this

  if (state.isGameStarted) {
    this.clientSend(client, "gameError", "You're already playing.")
    return
  }

  const currentIdx = state.clients.findIndex((c) => c.id === client.sessionId)

  if (currentIdx === -1) {
    this.clientSend(client, "gameError", "Unknown clientID.")
    return
  }

  state.clients[currentIdx].ready = message.ready
}
