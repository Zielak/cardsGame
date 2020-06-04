import { BotConditions } from "../conditions/bot"
import { Player } from "../players/player"
import { State } from "../state/state"
import { BotActionsSet } from "./action"

export type BotGoal<S extends State> = {
  name: string
  description?: string

  /**
   * Should this activity be considered outside of my turn?
   */
  parallel?: boolean

  /**
   * Tell me is this goal achievable right now.
   *
   * If omitted, goal will be considered.
   */
  condition?: (con: BotConditions<S>) => void

  /**
   * Higher value represents an activity which can result
   * with the best outcome for current player,
   * or the worst outcome for the opponent
   */
  value: (state: S, player: Player) => number

  /**
   * A set of actions bot may take during this activity.
   * Bot will try to take as much of these actions as possible, as many times as they see fit.
   *
   * Each action taken is sent to `CommandsManager`.
   */
  actions: BotActionsSet<S>
}

export type BotGoalsSet<S extends State> = Set<BotGoal<S>>
