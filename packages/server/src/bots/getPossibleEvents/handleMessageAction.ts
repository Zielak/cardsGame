import { MessageActionDefinition } from "@/actions/message/messageAction.js"
import {
  playerMessageToInitialSubjects,
  prepareConditionsContext,
} from "@/conditions/context/internalIndex.js"
import type { Bot } from "@/player/bot.js"
import type { State } from "@/state/state.js"
import { populatePlayerEvent } from "@/utils/populatePlayerEvent.js"

import type { BotNeuron } from "../botNeuron.js"

export function handleMessageAction<S extends State>(
  state: S,
  bot: Bot,
  neuron: BotNeuron<S>,
  action: MessageActionDefinition<S>,
): ClientPlayerMessage[] {
  const message: ClientPlayerMessage = {
    messageType: action.templateMessageType,
    data: neuron.playerEventData
      ? getDataGivenPlayerEventData(
          state,
          bot,
          neuron.playerEventData,
          action.templateMessageType,
        )
      : undefined,
  }

  return [message]
}

function getDataGivenPlayerEventData<S extends State>(
  state: S,
  bot: Bot,
  playerEventData: BotNeuron<S>["playerEventData"],
  messageType: string,
): ClientPlayerMessage["data"] {
  const event: ClientPlayerMessage = {
    messageType: messageType,
  }
  const inputMessage = populatePlayerEvent(state, event, bot)
  const initialSubjects = playerMessageToInitialSubjects(inputMessage)
  const messageContext = prepareConditionsContext(state, initialSubjects)

  return playerEventData(messageContext)
}
