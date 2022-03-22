import { performance } from "perf_hooks"

import { chalk, decimal, Logs } from "@cardsgame/utils"

import {
  isInteractionOfEntities,
  isInteractionOfEvent,
} from "../actionTemplate"
import { filterActionsByConditions } from "../interaction"
import type { Bot } from "../players/bot"
import { queryRunner } from "../queryRunner"
import type { State } from "../state"
import type { ChildTrait } from "../traits/child"
import { populatePlayerEvent } from "../utils/populatePlayerEvent"

import type { BotNeuron } from "./botNeuron"
import { BotConditions, EntityConditions } from "./conditions"

const logs = new Logs("pickNeuron", true, { serverStyle: chalk.bgGreen.white })

/**
 * Considers only Neuron's own `conditions`
 */
const filterNeuronConditions =
  <S extends State>(state: S, bot: Bot) =>
  (neuron: BotNeuron<S>): boolean => {
    if (neuron.conditions) {
      const con = new BotConditions<S>(state, { player: bot })
      try {
        neuron.conditions(con)
      } catch (e) {
        return false
      }
    }

    return true
  }

/**
 * Grabs entities, which could become given neuron's interaction target
 */
const auxillaryEntitiesFilter =
  <S extends State>(
    state: S,
    bot: Bot,
    { action, entitiesFilter }: BotNeuron<S>
  ) =>
  (entity: ChildTrait): boolean => {
    if (!action || !isInteractionOfEntities(action)) {
      // `getNeuronsAvailableEvents()` already ensures this action is of entities...
      return true
    } else if (Array.isArray(entitiesFilter)) {
      return entitiesFilter.some((query) => queryRunner(query)(entity))
    } else if (typeof entitiesFilter === "function") {
      const con = new EntityConditions<S>(state, { entity }, "entity")
      try {
        entitiesFilter(con)
      } catch (e) {
        return false
      }
    }
    return true
  }

const grabAllInteractionEntities = <S extends State>(
  state: S,
  bot: Bot,
  neuron: BotNeuron<S>
): ChildTrait[] => {
  const { action } = neuron

  if (!action || !isInteractionOfEntities(action)) {
    logs.debug(`not an action of entities`)
    return []
  }

  // Grab all entities from INTERACTIONS
  const queries = action.interaction(bot)

  logs.debug(
    `Action "${chalk.bold(action.name)}" has ${queries.length} QuerableProps`
  )

  // results = results.reduce((all, query) => all.push(query) && all, new Array<QuerableProps>())

  return queries
    .map((query) => state.queryAll(query))
    .reduce((all, entities) => all.concat(entities), new Array<ChildTrait>())
}

const getNeuronsAvailableEvents = <S extends State>(
  state: S,
  bot: Bot,
  neuron: BotNeuron<S>
): ClientPlayerMessage[] => {
  if (!neuron.action) {
    throw new Error(`Neuron without children should have an "action" assigned!`)
  }
  if (isInteractionOfEntities(neuron.action)) {
    // Grab only interesting entities
    const allEntities = grabAllInteractionEntities(state, bot, neuron)

    const interactionTargets = allEntities.filter(
      auxillaryEntitiesFilter(state, bot, neuron)
    )

    logs.debug(
      `Entities: ${allEntities.length} => post aux: ${interactionTargets.length}`
    )

    const testedEvents = interactionTargets
      // Create events for clicking those entities
      .map(
        (entity) =>
          ({
            messageType: "EntityInteraction",
            entityPath: entity.idxPath,
          } as ClientPlayerMessage)
      )
      // and test if such event would pass
      .filter((event) => {
        logs.debug("entity.idxPath:", event.entityPath)
        const serverEvent = populatePlayerEvent(state, event, bot)
        return filterActionsByConditions(state, serverEvent)(neuron.action)
      })

    logs.debug(`\`-> testedEvents ${testedEvents.length}`)

    return testedEvents
  } else if (isInteractionOfEvent(neuron.action)) {
    const message: ClientPlayerMessage = {
      messageType: neuron.action.interaction,
      data: neuron.playerEventData
        ? neuron.playerEventData(state, bot)
        : undefined,
    }

    return [message]
  }
  throw new Error(`Somehow got "action" in unexpected format`)
}

export type ChosenBotNeuronResult<S extends State> = {
  message: ClientPlayerMessage
  neuron: BotNeuron<S>
}

const _time = (_start): string => {
  const delta = decimal(performance.now() - _start, 1)
  let color
  if (delta >= 100) {
    color = chalk.white.bgRed
  } else if (delta >= 50) {
    color = chalk.white.bgYellow
  } else {
    color = chalk.bgGreen
  }
  return color(`(${delta}ms)`)
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

  logs.group(
    chalk.white(`pickNeuron(${bot.clientID}/${bot.name}) | ${rootNeuron.name}`)
  )

  // 1. Filter all current level neurons by their own conditions
  logs.debug(chalk.white("Conditions of Neurons:"))
  const neurons = rootNeuron.children.filter(filterNeuronConditions(state, bot))
  if (neurons.length === 0) {
    logs.groupEnd(`Discarded ALL neurons, abort ${_time(_start)}.`) // End root logs group
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
  neurons.sort((a, b) => b.value(state, bot) - a.value(state, bot))
  neurons.forEach((neuron) => {
    logs.debug(`$${decimal(neuron.value(state, bot))} -> ${neuron.name}`)
  })

  logs.debug(chalk.white("Simulating events:"))
  const results = neurons
    .map((neuron) => {
      // 3. For each child neuron, repeat `pickNeuron` now.
      if (neuron.children) {
        return pickNeuron(neuron, state, bot)
      }
      // 4. Simulate all possible events on all neurons and filter out any fails
      const events = getNeuronsAvailableEvents(state, bot, neuron)

      if (events.length > 0) {
        return { neuron, message: events[0] } as ChosenBotNeuronResult<S>
      }
      return undefined
    })
    // 5. Filter our any failed attempts
    .filter((v) => v)

  const _actionsCount = chalk.bold(`${results.length} actions`)
  logs.groupEnd(
    `${_countByConditions} neurons => ${_actionsCount} ${_time(_start)}`
  )

  return results[0]
}
