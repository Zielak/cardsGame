import { performance } from "perf_hooks"

import { decimal, ServerLogger } from "@cardsgame/utils"
import chalk from "chalk"

import { type CommandsManager } from "@/commandsManager/commandsManager.js"
import { ClientMessageContext } from "@/conditions/context/clientMessage.js"
import { ENTITY_INTERACTION } from "@/interaction/constants.js"
import type { Bot } from "@/player/bot.js"
import type { State } from "@/state/state.js"

import type { BotNeuron } from "../botNeuron.js"
import { getPossibleEvents } from "../getPossibleEvents/getPossibleEvents.js"
import { markDebugTime } from "../utils.js"

import { filterNeuronConditions } from "./filterConditions.js"

export const logs = new ServerLogger("pickNeuron", true, chalk.bgHex("#003300"))

export type ChosenBotNeuronResult<S extends State> = {
  message: ClientPlayerMessage
  neuron: BotNeuron<S>
}

type PickNeuronOptions<S extends State> = {
  rootNeuron: BotNeuron<S>
  state: S
  bot: Bot
}

/**
 * Pick a goal for bot given current game state.
 * May return `null` indicating there's nothing interesting to do.
 */
export const pickNeuron = <S extends State>({
  rootNeuron,
  state,
  bot,
}: PickNeuronOptions<S>): ChosenBotNeuronResult<S> => {
  const _start = performance.now()
  let neuronLog: string[]

  const botContext: ClientMessageContext<S> = {
    state,
    variant: state.variantData,
    player: bot,
    messageType: ENTITY_INTERACTION,
  }

  logs.group(
    chalk.white(`pickNeuron(${bot.clientID}/${bot.name}) | ${rootNeuron.name}`),
  )

  // 1. Filter all current level neurons by their own conditions
  neuronLog = []
  const neurons = rootNeuron.children.filter((neuron) => {
    const res = filterNeuronConditions(botContext)(neuron)
    neuronLog.push(
      res
        ? chalk.greenBright(`✔︎ ${neuron.name}`)
        : chalk.redBright(`❌ ${neuron.name}`),
    )
    return res
  })
  const _countByConditions = neurons.length
  if (neurons.length === 0) {
    logs.groupEnd(`Discarded ALL neurons, abort ${markDebugTime(_start)}.`) // End root logs group
    return undefined
  } else {
    logs.debug(
      chalk.white("Conditions:"),
      `(${_countByConditions}/${rootNeuron.children.length})`,
      neuronLog.join(", "),
    )
  }

  // 2. Sort by their values
  neuronLog = []
  neurons.sort((a, b) => b.value(botContext) - a.value(botContext))
  neurons.forEach((neuron) => {
    neuronLog.push(`$${decimal(neuron.value(botContext))} ${neuron.name}`)
  })

  logs.debug(chalk.white("    Values:"), neuronLog.join(", "))

  // ---

  logs.debug(chalk.white("Simulating:"))
  const results = neurons
    .map((neuron) => {
      // 3. For each child neuron, repeat `pickNeuron` now.
      if (neuron.children) {
        return pickNeuron({ rootNeuron: neuron, state, bot })
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
    `${_countByConditions} neurons => ${_actionsCount} ${markDebugTime(
      _start,
    )}`,
  )

  return results[0]
}
