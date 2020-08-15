import { ActionTemplate } from "../actionTemplate"
import { Bot } from "../players/bot"
import { QuerableProps } from "../queryRunner"
import { State } from "../state/state"
import { BotConditions, EntityConditions } from "./conditions"

export interface BotNeuron<S extends State> {
  name: string
  description?: string

  /**
   * Additional conditions to guide bot in the right direction.
   * `Conditions` here is limited, you can only assess current player and game state.
   *
   * Optional, use as _"energy saver"_.
   * For example, if an action requires player to have certain kind of card in their hand, you can quickly assert that here.
   * Otherwise, bot will brute force its way to understand if this action can be played.
   */
  conditions?: (con: BotConditions<S>) => void

  /**
   * With higher values bot is more likely to pick that Neuron.
   *
   * Bots may try to pick the same child-Neuron multiple times in a row, if the game still allows it (eg.: picking multiple cards of the same rank).
   *
   * Optional, by default the value is considered to be `0`.
   */
  value: (state: S, bot: Bot) => number

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
