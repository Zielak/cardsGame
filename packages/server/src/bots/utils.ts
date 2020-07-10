import { decimal } from "@cardsgame/utils"

import { Bot } from "../players/bot"
import { State } from "../state/state"
import { ChildTrait } from "../traits/child"
import { BotNeuron } from "./botNeuron"
import { BotConditions } from "./conditions"

const STUPIDITY_RANGE = 50

export type EntitySubject = { entity: ChildTrait }

export const botsValueError = (bot: Bot): number => {
  if (bot.intelligence === 0) {
    return Math.random() * 1000 - 500
  }

  return decimal(
    (Math.random() * STUPIDITY_RANGE - STUPIDITY_RANGE / 2) *
      (1 - bot.intelligence)
  )
}

export const filterNeuronCondition = <S extends State>(state: S, bot: Bot) => (
  neuron: BotNeuron<S>
): boolean => {
  if (neuron.conditions) {
    const con = new BotConditions<S>(state, { player: bot })
    try {
      neuron.conditions(con)
    } catch (e) {
      return false
    }
  }
  return true
}

export const pickMostValuable = <S extends State>(
  entries: BotNeuron<S>[],
  state: S,
  bot: Bot
): BotNeuron<S> => {
  // Calculate values of each action
  const entryValues = new Map<BotNeuron<S>, number>()
  entries.forEach((entry) => {
    const value = entry.value ? entry.value(state, bot) : 0
    entryValues.set(entry, value + botsValueError(bot))
  })

  // Pick the most valuable goal
  const mostValuable: [BotNeuron<S>, number] = [null, -Infinity]
  entryValues.forEach((value, entry) => {
    if (value > mostValuable[1]) {
      mostValuable[0] = entry
      mostValuable[1] = value
    }
  })

  return mostValuable[0]
}
