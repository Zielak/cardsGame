import type { Client } from "@colyseus/core"

import type { Room } from "@/room/base.js"
import type { State } from "@/state/state.js"

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

  const bot = this.botClients.find((bot) => bot.clientID === message.id)

  if (bot) {
    this.removeClient(bot.clientID)
    this.botClients.splice(this.botClients.indexOf(bot), 1)
  } else {
    this.clients.find((c) => c.sessionId === message.id)?.leave()
  }
}
