import type { Bot } from "../../player/bot.js"
import type { State } from "../../state/state.js"
import type { BotNeuron } from "../botNeuron.js"
import {
  BotConditions,
  BotConditionsInitialSubjects,
  prepareBotConditionsContext,
} from "../conditions.js"

/**
 * Considers only Neuron's own `conditions`
 */
export const filterNeuronConditions =
  <S extends State>(state: S, bot: Bot) =>
  (neuron: BotNeuron<S>): boolean => {
    if (neuron.conditions) {
      const initialSubjects: BotConditionsInitialSubjects = { player: bot }
      const botContext = prepareBotConditionsContext(state, initialSubjects)

      const con = new BotConditions<S>(state, botContext)
      try {
        neuron.conditions(con, botContext)
      } catch (e) {
        return false
      }
    }

    return true
  }
