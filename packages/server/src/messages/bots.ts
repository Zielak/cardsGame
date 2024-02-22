import { def } from "@cardsgame/utils"

import { Bot } from "../player/bot.js"
import type { Room } from "../room/base.js"
import type { State } from "../state/state.js"

/**
 * Create and add new Bot player to clients list.
 * @returns clientID of newly created bot, if added successfully.
 * @ignore
 */
export function botAdd(
  this: Room<State>,
  client,
  message: ClientMessageTypes["bot_add"],
): void {
  const { state } = this

  if (state.isGameStarted) {
    return
  }

  const clientID = `botPlayer${this.botClients.length}`
  if (this.addClient(clientID)) {
    const bot = new Bot({
      actionDelay: () => Math.random() + 0.5,
      intelligence: def(message?.intelligence, 0.5),
      clientID,
    })
    this.botClients.push(bot)
  }
}

/**
 * Remove bot client from `state.clients`
 * @ignore
 */
export function botRemove(
  this: Room<State>,
  client,
  message: ClientMessageTypes["bot_remove"],
): void {
  const bot = message.id
    ? this.botClients.find((entry) => entry.clientID === message.id)
    : this.botClients[this.botClients.length - 1]

  if (bot) {
    const clientIdx = this.state.clients.indexOf(bot.clientID)
    this.state.clients.splice(clientIdx, 1)
    this.botClients = this.botClients.filter((b) => b !== bot)
  }
}
