import { BotConditions } from "../conditions/bot"
import { Player } from "../players/player"
import { State } from "../state/state"

/**
 * Wrapper for ActionTemplate, to help bots decide.
 */
export type BotAction<S extends State> = {
  name: string
  description?: string

  /**
   * Tell me if this action is possible right now.
   *
   * If omitted, action will be allowed.
   */
  condition?: (con: BotConditions<S>) => void

  /**
   * With higher values bot is more likely to pick that action.
   * Return `-Infinity` to make bot ignore this action.
   * Remember, bot may try to pick same action multiple times but for different entities.
   *
   * Optional, by default the value is `0`.
   */
  value?: (state: S, player: Player) => number

  /**
   * Bot needs to imitate player's event.
   * Fill the event object with every needed value.
   */
  event: (state: S, player: Player) => BotPlayerEvent
}

export type BotActionsSet<S extends State> = Set<BotAction<S>>
