import type { Client } from "@colyseus/core"

import type { Room } from "../room/base.js"
import type { State } from "../state/state.js"

/**
 * @ignore
 */
export function kick(
  this: Room<State>,
  client: Client,
  message: ClientMessageTypes["kick"],
): void {
  const { state } = this

  if (state.isGameStarted) {
    this.clientSend(
      client,
      "gameError",
      "Kicking players during the game unsupported yet.",
    )
    return
  }

  if (client.sessionId === message.id) {
    this.clientSend(client, "gameError", "Don't kick yourself.")
    return
  }

  const bot = this.botClients.find((c) => c.clientID === message.id)

  if (bot) {
    this.removeBot(bot.clientID)
  } else {
    this.clients.find((c) => c.sessionId === message.id)?.leave()
  }
}
