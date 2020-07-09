import { Bot } from "../players/bot"
import { State } from "../state/state"
import { BotNeuron } from "./botNeuron"
import { filterNeuronCondition, pickMostValuable } from "./utils"

/**
 * Pick a goal for bot given current game state.
 * May return `null` indicating there's nothing interesting to do.
 */
export const pickNeuron = <S extends State>(
  neuronLeaves: BotNeuron<S>[],
  state: S,
  bot: Bot
): BotNeuron<S> => {
  const possible = neuronLeaves.filter(filterNeuronCondition<S>(state, bot))
  const mostValuable = pickMostValuable<S>(possible, state, bot)

  if (Array.isArray(mostValuable.action)) {
    return pickNeuron(mostValuable.action, state, bot)
  }
  return mostValuable
}
