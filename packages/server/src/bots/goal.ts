import { Conditions } from "../conditions"
import { Player } from "../players/player"
import { State } from "../state/state"
import { BotActionsSet } from "./action"

export interface BotGoal<S extends State> {
  name: string
  description?: string

  /**
   * Tell me is this goal achievable right now.
   *
   * If omitted, goal will be considered.
   */
  condition?: (con: Conditions<S>) => void

  /**
   * Higher value represents an activity which can result
   * with the best outcome for current player,
   * or the worst outcome for the opponent.
   *
   * Optional, by default the value is considered to be `0`.
   */
  value?: (state: S, player: Player) => number

  /**
   * A set of actions bot may take during this activity.
   * Bot will try to take as much of these actions as possible, as many times as they see fit.
   *
   * Each action taken is sent to `CommandsManager`.
   */
  actions: BotActionsSet<S>
}

export type BotGoalsSet<S extends State> = Set<BotGoal<S>>
