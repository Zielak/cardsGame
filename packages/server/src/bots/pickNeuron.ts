import { performance } from "perf_hooks"

import { chalk, decimal, Logs } from "@cardsgame/utils"

import { isEntityActionDefinition } from "../actions/entityAction.js"
import { isMessageActionDefinition } from "../actions/messageAction.js"
import {
  ClientMessageConditions,
  ClientMessageInitialSubjects,
} from "../interaction/conditions.js"
import type { Bot } from "../player/bot.js"
import { queryRunner } from "../queries/runner.js"
import type { State } from "../state/state.js"
import type { ChildTrait } from "../traits/child.js"
import { populatePlayerEvent } from "../utils/populatePlayerEvent.js"

import type { BotNeuron } from "./botNeuron.js"
import {
  BotConditions,
  BotConditionsInitialSubjects,
  EntityConditions,
} from "./conditions.js"
import { markDebugTime } from "./utils.js"

const logs = new Logs("pickNeuron", true, { serverStyle: chalk.bgGreen.white })

/**
 * Considers only Neuron's own `conditions`
 */
const filterNeuronConditions =
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

/**
 * Grabs entities, which could become given neuron's interaction target
 */
const auxillaryEntitiesFilter =
  <S extends State>(state: S, { action, entitiesFilter }: BotNeuron<S>) =>
  (entity: ChildTrait): boolean => {
    if (!action || !isEntityActionDefinition(action)) {
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

  if (!action || !isEntityActionDefinition(action)) {
    logs.debug(`not an action of entities`)
    return []
  }

  // Grab all entities from INTERACTIONS
  const queries = action.interaction(bot)

  if (queries === "*") {
    logs.debug(
      `Action "${chalk.bold(
        action.name
      )}" has a "catch-all" definition, ignoring (for now?)`
    )
    return []
  }

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
  if (isEntityActionDefinition(neuron.action)) {
    // Grab only interesting entities
    const allEntities = grabAllInteractionEntities(state, bot, neuron)

    const interactionTargets = allEntities.filter(
      auxillaryEntitiesFilter(state, neuron)
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
            interaction: "tap",
            entityPath: entity.idxPath,
          } as ClientPlayerMessage)
      )
      // and test if such event would pass
      .filter((event) => {
        logs.debug("entity.idxPath:", event.entityPath)
        const serverEvent = populatePlayerEvent(state, event, bot)

        const initialSubjects = Object.keys(serverEvent)
          .filter(
            (key) => !["timestamp", "entities", "entityPath"].includes(key)
          )
          .reduce((o, key) => {
            o[key] = serverEvent[key]
            return o
          }, {} as ClientMessageInitialSubjects)

        const conditionsChecker = new ClientMessageConditions<S>(
          state,
          initialSubjects
        )

        try {
          return false
          // neuron.action.checkConditions(conditionsChecker, initialSubjects, {})
        } catch (e) {
          return false
        }
      })

    logs.debug(`\`-> testedEvents ${testedEvents.length}`)

    return testedEvents
  } else if (isMessageActionDefinition(neuron.action)) {
    const message: ClientPlayerMessage = {
      messageType: neuron.action.messageType,
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
    `${_countByConditions} neurons => ${_actionsCount} ${markDebugTime(_start)}`
  )

  return results[0]
}
