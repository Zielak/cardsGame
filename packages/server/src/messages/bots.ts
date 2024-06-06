import { def } from "@cardsgame/utils"
import type { Client } from "@colyseus/core"

import type { Room } from "../room/base.js"
import type { State } from "../state/state.js"

/**
 * Create and add new Bot player to clients list.
 * @returns clientID of newly created bot, if added successfully.
 * @ignore
 */
export function botAdd(
  this: Room<State>,
  client: Client,
  message: ClientMessageTypes["bot_add"],
): void {
  const { state } = this

  if (state.isGameStarted) {
    this.clientSend(
      client,
      "gameError",
      "Game already started, not adding bots.",
    )
    return
  }

  const result = this.addBot({
    actionDelay: () => Math.random() + 0.5,
    intelligence: def(message?.intelligence, 0.5),
    clientID: `botPlayer${this.botClients.length}`,
  })

  if (!result) {
    this.clientSend(client, "gameError", "Couldn't add bot.")
    return
  }
}
