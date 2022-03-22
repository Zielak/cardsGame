import { def } from "@cardsgame/utils"

import { Bot } from "../players/bot"
import type { Room } from "../room"
import type { State } from "../state"

/**
 * Create and add new Bot player to clients list.
 * @returns clientID of newly created bot, if added successfully.
 */
export function botAdd(
  this: Room<State>,
  client,
  message: { intelligence: number }
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
 */
export function botRemove(
  this: Room<State>,
  client,
  message: { id: string }
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
