import { performance } from "perf_hooks"

import { chalk, decimal, Logs } from "@cardsgame/utils"

import { ClientMessageContext } from "../../conditions/context/clientMessage.js"
import { ENTITY_INTERACTION } from "../../interaction/constants.js"
import type { Bot } from "../../player/bot.js"
import type { State } from "../../state/state.js"
import type { BotNeuron } from "../botNeuron.js"
import { markDebugTime } from "../utils.js"

import { filterNeuronConditions } from "./filterConditions.js"
import { getPossibleEvents } from "./getPossibleEvents.js"

export const logs = new Logs("pickNeuron", true, {
  serverStyle: chalk.bgGreen.white,
})

export type ChosenBotNeuronResult<S extends State> = {
  message: ClientPlayerMessage
  neuron: BotNeuron<S>
}

/**
 * Pick a goal for bot given current game state.
 * May return `null` indicating there's nothing interesting to do.
 */
export const pickNeuron = <S extends State>(
  rootNeuron: BotNeuron<S>,
  state: S,
  bot: Bot
): ChosenBotNeuronResult<S> => {
  const _start = performance.now()

  const botContext: ClientMessageContext<S> = {
    state,
    variant: state.variantData,
    player: bot,
    messageType: ENTITY_INTERACTION,
  }

  logs.group(
    chalk.white(`pickNeuron(${bot.clientID}/${bot.name}) | ${rootNeuron.name}`)
  )

  // 1. Filter all current level neurons by their own conditions
  logs.debug(chalk.white("Conditions of Neurons:"))
  const neurons = rootNeuron.children.filter(filterNeuronConditions(botContext))
  if (neurons.length === 0) {
    logs.groupEnd(`Discarded ALL neurons, abort ${markDebugTime(_start)}.`) // End root logs group
    return undefined
  } else {
    neurons.forEach((neuron) => {
      logs.debug(`${chalk.bgGreen.white(" ✔︎ ")} ${neuron.name}`)
    })
  }
  const _countByConditions = neurons.length
  logs.debug(
    `${rootNeuron.children.length} neurons => ${_countByConditions} neurons`
  )

  // 2. Sort by their values
  logs.debug(chalk.white("Values:"))
  neurons.sort((a, b) => b.value(botContext) - a.value(botContext))
  neurons.forEach((neuron) => {
    logs.debug(`$${decimal(neuron.value(botContext))} -> ${neuron.name}`)
  })

  logs.debug(chalk.white("Simulating events:"))
  const results = neurons
    .map((neuron) => {
      // 3. For each child neuron, repeat `pickNeuron` now.
      if (neuron.children) {
        return pickNeuron(neuron, state, bot)
      }
      // 4. Simulate all possible events on all neurons and filter out any fails
      const events = getPossibleEvents(state, bot, neuron)

      if (events.length > 0) {
        return { neuron, message: events[0] } as ChosenBotNeuronResult<S>
      }
      return undefined
    })
    // 5. Filter our any failed attempts
    .filter((v) => v)

  const _actionsCount = chalk.bold(`${results.length} actions`)
  logs.groupEnd(
    `${_countByConditions} neurons => ${_actionsCount} ${markDebugTime(_start)}`
  )

  return results[0]
}
