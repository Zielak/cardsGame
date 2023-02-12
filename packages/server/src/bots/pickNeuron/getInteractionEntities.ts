import { chalk } from "@cardsgame/utils"

import { isEntityActionDefinition } from "../../actions/entityAction.js"
import type { Bot } from "../../player/bot.js"
import type { State } from "../../state/state.js"
import type { ChildTrait } from "../../traits/child.js"
import type { BotNeuron } from "../botNeuron.js"

import { logs } from "./pickNeuron.js"

export const getInteractionEntities = <S extends State>(
  state: S,
  bot: Bot,
  neuron: BotNeuron<S>
): ChildTrait[] => {
  const { action } = neuron

  if (!isEntityActionDefinition(action)) {
    logs.debug(`not an action of entities`)
    return []
  }

  // Grab all entities from INTERACTIONS
  const queries = action.templateInteraction(bot)

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
