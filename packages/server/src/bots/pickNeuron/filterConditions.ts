import { Conditions } from "@/conditions/conditions.js"
import { ClientMessageContext } from "@/conditions/context/clientMessage.js"
import type { State } from "@/state/state.js"

import type { BotNeuron } from "../botNeuron.js"

/**
 * Considers only Neuron's own `conditions`
 */
export const filterNeuronConditions =
  <S extends State>(botContext: ClientMessageContext<S>) =>
  (neuron: BotNeuron<S>): boolean => {
    if (neuron.conditions) {
      const con = new Conditions<ClientMessageContext<S>>(botContext)

      try {
        neuron.conditions(con, botContext)
      } catch (e) {
        return false
      }
    }

    return true
  }
