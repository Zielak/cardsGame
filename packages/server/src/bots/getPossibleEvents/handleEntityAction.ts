import type { EntityActionDefinition } from "@/actions/entity/entityAction.js"
import { Conditions } from "@/conditions/conditions.js"
import {
  playerMessageToInitialSubjects,
  prepareConditionsContext,
} from "@/conditions/context/internalIndex.js"
import { ENTITY_INTERACTION } from "@/interaction/constants.js"
import type { Bot } from "@/player/bot.js"
import type { State } from "@/state/state.js"
import { populatePlayerEvent } from "@/utils/populatePlayerEvent.js"

import type { BotNeuron } from "../botNeuron.js"
import { auxillaryEntitiesFilter } from "../pickNeuron/auxEntitiesFilter.js"
import { getInteractionEntities } from "../pickNeuron/getInteractionEntities.js"
import { logs } from "../pickNeuron/pickNeuron.js"

export function handleEntityAction<S extends State>(
  state: S,
  bot: Bot,
  neuron: BotNeuron<S>,
  action: EntityActionDefinition<S>,
): ClientPlayerMessage[] {
  // Grab only interesting entities
  const allEntities = getInteractionEntities(state, bot, neuron)

  const interactionTargets = allEntities.filter(
    auxillaryEntitiesFilter(state, neuron),
  )

  logs.debug(
    `Entities: ${allEntities.length} => post aux: ${interactionTargets.length}`,
  )

  const testedEvents = interactionTargets
    // Create events for clicking those entities
    .map(
      (entity) =>
        ({
          messageType: ENTITY_INTERACTION,
          interaction: "tap",
          entityPath: entity.idxPath,
        }) as ClientPlayerMessage,
    )
    // and test if such event would pass
    .filter((event) => {
      logs.debug("entity.idxPath:", event.entityPath)
      const message = populatePlayerEvent(state, event, bot)

      const initialSubjects = playerMessageToInitialSubjects(message)
      const messageContext = prepareConditionsContext(state, initialSubjects)

      const conditionsChecker = new Conditions(messageContext)

      try {
        logs.debug(`pre checkConditions()`)
        action.checkConditions(conditionsChecker, messageContext)
      } catch (e) {
        logs.debug(`checkConditions() FAILED!`, e)
        return false
      }
      return true
    })

  logs.debug(`\`-> testedEvents ${testedEvents.length}`)

  return testedEvents
}
