import { def, limit } from "@cardsgame/utils"

import type { ChosenBotNeuronResult } from "@/bots/pickNeuron/pickNeuron.js"

import { Player, PlayerOptions } from "./player.js"

export interface BotOptions extends PlayerOptions {
  /**
   * Delay in seconds, before taking an action. Imitates the "thinking" of player.
   */
  actionDelay?: (() => number) | number

  /**
   * In range 0...1 how precise this bot should be in
   * picking its goals and actions? Defaults to 0.5
   *
   * Exact value `0` will force bot to make random `BotGoal` choices.
   */
  intelligence?: number
}

/**
 *
 * @category Bot
 */
export class Bot extends Player {
  actionDelay: (() => number) | number
  intelligence: number
  isBot = true

  currentThought: ChosenBotNeuronResult<any>
  currentThoughtTimer: any

  constructor(options: BotOptions) {
    super(options)

    this.actionDelay = def(options.actionDelay, 500)
    this.intelligence = def(limit(options.intelligence, 0, 1), 0.5)
  }
}

/**
 * Type guard to ensure an object is Bot, and not just Player
 * @param player
 * @returns {boolean}
 *
 * @category Bot
 */
export function isBot(player: unknown): player is Bot {
  return (
    player &&
    typeof player === "object" &&
    "clientID" in player &&
    typeof player["name"] === "string" &&
    "isBot" in player &&
    player["isBot"] === true
  )
}
