import { decimal } from "@cardsgame/utils"

import { BotConditions } from "../conditions/bot"
import { Bot } from "../players/bot"
import { State } from "../state/state"
import { BotAction } from "./action"
import { BotGoal } from "./goal"

const STUPIDITY_RANGE = 50

export const botsValueError = (bot: Bot): number => {
  if (bot.intelligence === 0) {
    return Math.random() * 1000 - 500
  }

  return decimal(
    (Math.random() * STUPIDITY_RANGE - STUPIDITY_RANGE / 2) *
      (1 - bot.intelligence)
  )
}

type GoalOrAction<S extends State> = BotAction<S> | BotGoal<S>

export function isGoalOrAction<S extends State>(
  object: any
): object is GoalOrAction<S> {
  return (
    "event" in object &&
    typeof object.event === "function" &&
    "actions" in object &&
    typeof object.actions === "object" &&
    object.actions instanceof Set
  )
}

export const filterOutGoalAction = <S extends State>(state: S, bot: Bot) => (
  goalOrAction: GoalOrAction<S>
): boolean => {
  if (goalOrAction.condition) {
    const conditions = new BotConditions<S>(state, bot)
    try {
      goalOrAction.condition(conditions)
    } catch (e) {
      return false
    }
  }
  return true
}

export const pickMostValuable = <S extends State, E extends GoalOrAction<S>>(
  entries: E[],
  state: S,
  bot: Bot
): E => {
  // Calculate values of each action
  const entryValues = new Map<E, number>()
  entries.forEach((entry) => {
    const value = entry.value ? entry.value(state, bot) : 0
    entryValues.set(entry, value + botsValueError(bot))
  })

  // Pick the most valuable goal
  const mostValuable: [E, number] = [null, -Infinity]
  entryValues.forEach((value, entry) => {
    if (value > mostValuable[1]) {
      mostValuable[0] = entry
      mostValuable[1] = value
    }
  })

  return mostValuable[0]
}
