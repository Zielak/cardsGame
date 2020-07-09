import { ActionTemplate } from "../actionTemplate"
import { Conditions } from "../conditions"
import { Bot } from "../players/bot"
import { QuerableProps } from "../queryRunner"
import { State } from "../state/state"
import { EntitySubject, PlayerSubject } from "./utils"

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
  conditions?: (con: Conditions<S, PlayerSubject>) => void

  /**
   * With higher values bot is more likely to pick that Neuron.
   *
   * Bots may try to pick the same child-Neuron multiple times in a row, if the game still allows it (eg.: picking multiple cards of the same rank).
   *
   * Optional, by default the value is considered to be `0`.
   */
  value: (state: S, bot: Bot) => number

  /**
   * `ActionTemplate` associated with this Neuron OR a group of `Neurons`.
   */
  action: ActionTemplate<S> | BotNeuron<S>[]

  /**
   * If your action targets `entities` too broadly, add additional filter here.
   *
   * Can simply be additional `QuerableProps` object, or more advanced function
   * of conditions - subject is automatically set to each entity.
   */
  entitiesFilter?:
    | ((con: Conditions<S, EntitySubject>) => void)
    | QuerableProps[]

  /**
   * Make bot generate additional `data`, if needed.
   * Will be passed to `ClientPlayerEvent.data`
   */
  playerEventData?: (state: S, bot: Bot) => any
}
