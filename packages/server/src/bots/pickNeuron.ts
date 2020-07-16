import { chalk, Logs } from "@cardsgame/utils"

import { isInteractionOfEntities } from "../actionTemplate"
import { filterActionsByConditions } from "../interaction"
import { Bot } from "../players/bot"
import { QuerableProps, queryRunner } from "../queryRunner"
import { State } from "../state/state"
import { ChildTrait } from "../traits/child"
import { populatePlayerEvent } from "../utils"
import { BotNeuron } from "./botNeuron"
import { BotConditions, EntityConditions } from "./conditions"

const logs = new Logs("pickNeuron", true, { serverStyle: chalk.bgCyan })

/**
 * Considers only Neuron's own `conditions`
 */
export const filterNeuronConditions = <S extends State>(state: S, bot: Bot) => (
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
export const auxillaryEntitiesFilter = <S extends State>(
  state: S,
  bot: Bot,
  { action, entitiesFilter }: BotNeuron<S>
) => (entity: ChildTrait): boolean => {
  if (!action || !isInteractionOfEntities(action)) {
    return false
  } else if (Array.isArray(entitiesFilter)) {
    return queryRunner(entitiesFilter)(entity)
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
    return []
  }

  // Grab all entities from INTERACTIONS
  return action
    .interaction(bot)
    .reduce((all, query) => all.push(query) && all, new Array<QuerableProps>())
    .map((query) => state.queryAll(query))
    .reduce((all, entities) => all.concat(entities), new Array<ChildTrait>())
}

const getNeuronsAvailableEvents = <S extends State>(
  state: S,
  bot: Bot,
  neuron: BotNeuron<S>
): ClientPlayerEvent[] => {
  // TODO: also consider Command Events!
  // Grab only interesting entities
  const interactionTargets = grabAllInteractionEntities(
    state,
    bot,
    neuron
  ).filter(auxillaryEntitiesFilter(state, bot, neuron))

  const testedEvents = interactionTargets
    // Create events for clicking those entities
    .map((entity) => ({ entityPath: entity.idxPath } as ClientPlayerEvent))
    // and test if such event would pass
    .filter((event) => {
      const serverEvent = populatePlayerEvent(state, event, bot)
      return filterActionsByConditions(state, serverEvent)(neuron.action)
    })

  return testedEvents
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
  let neurons = rootNeuron.children.filter(filterNeuronConditions(state, bot))
  logs.groupEnd()
  if (neurons.length === 0) {
    logs.notice(`Discarded ALL neurons, abort.`)
    return
  }

  // 2. Sort by their values
  logs.group("Values")
  neurons = neurons
    .sort((a, b) => b.value(state, bot) - a.value(state, bot))
    .map((neuron) => {
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
      // 4. Simulate all possible events on all neurons and filter any fails
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
