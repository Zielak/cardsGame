import type { Bot } from "../../player/bot.js"
import type { State } from "../../state/state.js"
import type { BotNeuron } from "../botNeuron.js"
import { BotConditions, BotConditionsInitialSubjects } from "../conditions.js"

/**
 * Considers only Neuron's own `conditions`
 */
export const filterNeuronConditions =
  <S extends State>(state: S, bot: Bot) =>
  (neuron: BotNeuron<S>): boolean => {
    if (neuron.conditions) {
      const initialSubjects: BotConditionsInitialSubjects = { player: bot }
      const con = new BotConditions<S>(state, initialSubjects)
      try {
        neuron.conditions(con, initialSubjects)
      } catch (e) {
        return false
      }
    }

    return true
  }
