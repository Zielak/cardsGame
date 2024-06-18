import { isCompoundActionDefinition } from "@/actions/compound/compoundAction.js"
import { isDragActionDefinition } from "@/actions/drag/utils.js"
import { isEntityActionDefinition } from "@/actions/entity/utils.js"
import { isMessageActionDefinition } from "@/actions/message/utils.js"
import type { ActionDefinition } from "@/actions/types.js"
import type { Bot } from "@/player/bot.js"
import type { State } from "@/state/state.js"

import type { BotNeuron } from "../botNeuron.js"

import { handleEntityAction } from "./handleEntityAction.js"
import { handleMessageAction } from "./handleMessageAction.js"

/**
 *
 *
 * @param state
 * @param bot
 * @param neuron
 * @param action
 * @returns
 */
export const getPossibleEvents = <S extends State>(
  state: S,
  bot: Bot,
  neuron: BotNeuron<S>,
  action?: ActionDefinition<S>,
): ClientPlayerMessage[] => {
  action = action ?? neuron.action

  if (!action) {
    throw new Error(`Neuron without children should have an "action" assigned!`)
  }

  if (isEntityActionDefinition(action)) {
    return handleEntityAction(state, bot, neuron, action)
  } else if (isMessageActionDefinition(action)) {
    return handleMessageAction(state, bot, neuron, action)
  } else if (isDragActionDefinition(action)) {
    // TODO: ? drag action is 2 in one, action.start and action.end are both EntityInteraction actions.
    return []
  } else if (isCompoundActionDefinition(action)) {
    // TODO: Can't play Makao, because it has defineCompoundAction
    const messages = action.actions
      .concat(action.finishActions, action.abortActions)
      .map((subAction) => getPossibleEvents(state, bot, neuron, subAction))
      .flat()

    console.log("compound, got", messages.length)
    return messages
  }
  throw new Error(`Somehow got "action" in unexpected format`)
}
