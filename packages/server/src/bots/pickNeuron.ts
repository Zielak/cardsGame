import { chalk, Logs } from "@cardsgame/utils"

import {
  isInteractionOfEntities,
  isInteractionOfEvent,
} from "../actionTemplate"
import { filterActionsByConditions } from "../interaction"
import { Bot } from "../players/bot"
import { queryRunner } from "../queryRunner"
import { State } from "../state/state"
import { ChildTrait } from "../traits/child"
import { populatePlayerEvent } from "../utils"
import { BotNeuron } from "./botNeuron"
import { BotConditions, EntityConditions } from "./conditions"

const logs = new Logs("pickNeuron", true, { serverStyle: chalk.bgGreen.white })

/**
 * Considers only Neuron's own `conditions`
 */
const filterNeuronConditions = <S extends State>(state: S, bot: Bot) => (
  neuron: BotNeuron<S>
): boolean => {
  if (neuron.conditions) {
    const con = new BotConditions<S>(state, { player: bot })
    try {
      neuron.conditions(con)
    } catch (e) {
      logs.verbose(`"${neuron.name}" -> ${chalk.bgRed.white(" ✘ ")}`)

      return false
    }
  }

  logs.verbose(`"${neuron.name}" -> ${chalk.bgGreen.white(" ✔︎ ")}`)

  return true
}

/**
 * Grabs entities, which could become given neuron's interaction target
 */
const auxillaryEntitiesFilter = <S extends State>(
  state: S,
  bot: Bot,
  { action, entitiesFilter }: BotNeuron<S>
) => (entity: ChildTrait): boolean => {
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
    logs.verbose(`not an action of entities`)
    return []
  }

  // Grab all entities from INTERACTIONS
  const queries = action.interaction(bot)

  logs.verbose(`has ${queries.length} QuerableProps`)

  // results = results.reduce((all, query) => all.push(query) && all, new Array<QuerableProps>())

  return queries
    .map((query) => state.queryAll(query))
    .reduce((all, entities) => all.concat(entities), new Array<ChildTrait>())
}

const getNeuronsAvailableEvents = <S extends State>(
  state: S,
  bot: Bot,
  neuron: BotNeuron<S>
): ClientPlayerEvent[] => {
  if (!neuron.action) {
    throw new Error(`Neuron without children should have an "action" assigned!`)
  }
  if (isInteractionOfEntities(neuron.action)) {
    // Grab only interesting entities
    const allEntities = grabAllInteractionEntities(state, bot, neuron)

    logs.verbose(`allEntities: ${allEntities.length}`)

    const interactionTargets = allEntities.filter(
      auxillaryEntitiesFilter(state, bot, neuron)
    )

    logs.verbose(`post aux filter: ${allEntities.length}`)

    const testedEvents = interactionTargets
      // Create events for clicking those entities
      .map((entity) => {
        logs.verbose("entity.idxPath:", entity.idxPath)
        return { entityPath: entity.idxPath } as ClientPlayerEvent
      })
      // and test if such event would pass
      .filter((event) => {
        const serverEvent = populatePlayerEvent(state, event, bot)
        return filterActionsByConditions(state, serverEvent)(neuron.action)
      })

    logs.verbose(`\`-> testedEvents ${testedEvents.length}`)

    return testedEvents
  } else if (isInteractionOfEvent(neuron.action)) {
    const data = neuron.playerEventData
      ? neuron.playerEventData(state, bot)
      : undefined

    return [{ command: neuron.action.interaction, data }]
  }
}

export type ChosenBotNeuronResult<S extends State> = {
  neuron: BotNeuron<S>
  event: ClientPlayerEvent
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
  logs.notice(`pickNeuron | ${rootNeuron.name}`)

  // 1. Filter all current level neurons by their own conditions
  logs.group("Conditions of Neurons")
  const neurons = rootNeuron.children.filter(filterNeuronConditions(state, bot))
  logs.groupEnd()
  if (neurons.length === 0) {
    logs.notice(`Discarded ALL neurons, abort.`)
    return
  }

  // 2. Sort by their values
  logs.group("Values")
  neurons.sort((a, b) => b.value(state, bot) - a.value(state, bot))
  neurons.forEach((neuron) => {
    logs.notice(`${neuron.name} $${neuron.value(state, bot)}`)
    return neuron
  })
  logs.groupEnd()

  logs.group("Simulating events")
  const results = neurons
    .map((neuron) => {
      // 3. For each child neuron, repeat `pickNeuron` now.
      if (neuron.children) {
        return pickNeuron(neuron, state, bot)
      }
      // 4. Simulate all possible events on all neurons and filter out any fails
      const events = getNeuronsAvailableEvents(state, bot, neuron)

      if (events.length > 0) {
        return { neuron, event: events[0] } as ChosenBotNeuronResult<S>
      } else {
        return
      }
    })
    // 5. Filter our any failed attempts
    .filter((v) => v)
  logs.notice(`Left out with ${results.length} possible events`)
  logs.groupEnd()

  return results[0]
}
