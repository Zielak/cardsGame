import { logs } from "@cardsgame/utils"

import { Bot } from "../players/bot"
import { State } from "../state/state"
import { BotAction } from "./action"
import { BotGoal } from "./goal"
import { filterOutGoalAction, pickMostValuable } from "./utils"

/**
 * Pick an action to enact from given goal.
 * May return `null` indicating there's nothing else interesting to do.
 */
export const pickAction = <S extends State>(
  state: S,
  bot: Bot,
  goal: BotGoal<S>
): BotAction<S> => {
  const actions = [...goal.actions]

  // Grab all currently possible actions
  const availableActions = actions.filter(filterOutGoalAction<S>(state, bot))

  const action = pickMostValuable<S, BotAction<S>>(availableActions, state, bot)

  logs.notice("pickAction", `chosen action: ${action?.name}`)

  return action
}
