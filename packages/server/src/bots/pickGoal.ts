import { Bot } from "../players/bot"
import { State } from "../state/state"
import { BotGoal } from "./goal"
import { filterOutGoalAction, pickMostValuable } from "./utils"

/**
 * Pick a goal for bot given current game state.
 * May return `null` indicating there's nothing interesting to do.
 * @param state
 * @param bot
 */
export const pickGoal = <S extends State>(
  goals: BotGoal<S>[],
  state: S,
  bot: Bot
): BotGoal<S> => {
  const availableGoals = goals.filter(filterOutGoalAction<S>(state, bot))

  const goal = pickMostValuable<S, BotGoal<S>>(availableGoals, state, bot)

  return goal
}
