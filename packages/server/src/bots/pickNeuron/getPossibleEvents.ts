import { isDragActionDefinition } from "../../actions/drag/dragAction.js"
import { isEntityActionDefinition } from "../../actions/entityAction.js"
import { isMessageActionDefinition } from "../../actions/messageAction.js"
import { ClientMessageConditions } from "../../interaction/conditions.js"
import { ENTITY_INTERACTION } from "../../interaction/types.js"
import {
  playerMessageToInitialSubjects,
  prepareClientMessageContext,
} from "../../interaction/utils.js"
import type { Bot } from "../../player/bot.js"
import type { State } from "../../state/state.js"
import { populatePlayerEvent } from "../../utils/populatePlayerEvent.js"
import type { BotNeuron } from "../botNeuron.js"

import { auxillaryEntitiesFilter } from "./auxEntitiesFilter.js"
import { getInteractionEntities } from "./getInteractionEntities.js"
import { logs } from "./pickNeuron.js"

export const getPossibleEvents = <S extends State>(
  state: S,
  bot: Bot,
  neuron: BotNeuron<S>
): ClientPlayerMessage[] => {
  const { action } = neuron

  if (!action) {
    throw new Error(`Neuron without children should have an "action" assigned!`)
  }

  if (isEntityActionDefinition(action)) {
    // Grab only interesting entities
    const allEntities = getInteractionEntities(state, bot, neuron)

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
            messageType: ENTITY_INTERACTION,
            interaction: "tap",
            entityPath: entity.idxPath,
          } as ClientPlayerMessage)
      )
      // and test if such event would pass
      .filter((event) => {
        logs.debug("entity.idxPath:", event.entityPath)
        const message = populatePlayerEvent(state, event, bot)

        const initialSubjects = playerMessageToInitialSubjects(message)
        const messageContext = prepareClientMessageContext(
          state,
          initialSubjects
        )

        const conditionsChecker = new ClientMessageConditions<S>(
          state,
          messageContext
        )

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
  } else if (isMessageActionDefinition(action)) {
    const message: ClientPlayerMessage = {
      messageType: action.templateMessageType,
      data: neuron.playerEventData
        ? neuron.playerEventData(state, bot)
        : undefined,
    }

    return [message]
  } else if (isDragActionDefinition(action)) {
    // TODO: ? drag action is 2 in one, action.start and action.name are both EntityInteraction actions.
    return []
  }
  throw new Error(`Somehow got "action" in unexpected format`)
}
