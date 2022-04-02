import type { ActionTemplate } from "../actionTemplate"
import type { Bot } from "../player"
import type { QuerableProps } from "../queryRunner"
import type { State } from "../state"

import type { BotConditions, EntityConditions } from "./conditions"

export interface BotNeuron<S extends State> {
  name: string
  description?: string

  /**
   * Additional conditions to notify bot if it can perform this action.
   *
   * API of `Conditions` here is limited on purpose,
   * you can only assess current player (eg. for ownership) and game state.
   *
   * Optional, but without this, bot will  brute force its way through all
   * game elements to understand if this action can be played.
   */
  conditions?: (con: BotConditions<S>) => void

  /**
   * With higher values bot is more likely to pick that Neuron.
   *
   * Bots may try to pick the same child-Neuron multiple times in a row,
   * if the game still allows it (eg.: picking multiple cards of the same rank).
   *
   * Optional, by default the value is considered to be `0`.
   */
  value: (state: S, bot: Bot) => number

  /**
   * Scale up/down the time it takes the bot to act on this neuron.
   */
  thinkScale?: number

  /**
   * `ActionTemplate` associated with this Neuron.
   */
  action?: ActionTemplate<S>

  /**
   * Child neurons of this one.
   *
   * FIXME: Verify programmatically, that you defined either `action` OR `neurons`...
   *
   * TODO: BotNeuron Definition Parser?
   */
  children?: BotNeuron<S>[]

  /**
   * If your action targets `entities` too broadly, add additional filter here.
   *
   * Can simply be additional `QuerableProps` object, or more advanced function
   * of conditions - subject is automatically set to each entity.
   */
  entitiesFilter?: ((con: EntityConditions<S>) => void) | QuerableProps[]

  /**
   * Make bot generate additional `data`, if needed.
   * Will be passed to `ClientPlayerMessage.data`
   */
  playerEventData?: (state: S, bot: Bot) => any
}
