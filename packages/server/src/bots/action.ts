import { BotConditions } from "../conditions/bot"
import { Player } from "../players/player"
import { State } from "../state/state"

/**
 * Wrapper for ActionTemplate, to help bots decide.
 */
export interface BotAction<S extends State> {
  name: string
  description?: string

  /**
   * Tell me if this action is possible right now.
   *
   * Optional. If omitted, action will be allowed.
   */
  condition?: (con: BotConditions<S>) => void

  /**
   * With higher values bot is more likely to pick
   * that action _before_ any other action of the same goal.
   *
   * Remember, bot may try to pick same action multiple times during goal execution.
   *
   * Return `-Infinity` to make bot ignore this action.
   *
   * Optional, by default the value is considered to be `0`.
   */
  value?: (state: S, player: Player) => number

  /**
   * Bot needs to imitate player's event.
   * Fill the event object with every needed value.
   * @example
   * event: (state, player) => ({
   *   entity: state.query({ type: "deck" })
   * })
   * // or a command
   * event: (state, player) => ({
   *   command: "passTurn"
   * })
   */
  event: (state: S, player: Player) => BotPlayerEvent
}

export type BotActionsSet<S extends State> = Set<BotAction<S>>
