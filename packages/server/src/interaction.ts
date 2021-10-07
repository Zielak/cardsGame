import { chalk, logs } from "@cardsgame/utils"

import {
  ActionTemplate,
  isInteractionOfEntities,
  isInteractionOfEvent,
} from "./actionTemplate"
import { Conditions, ConditionsMethods } from "./conditions"
import { ServerPlayerMessage } from "./players/player"
import { queryRunner } from "./queryRunner"
import { State } from "./state"
import { isChild } from "./traits/child"

export const filterActionsByInteraction =
  <S extends State>(message: ServerPlayerMessage) =>
  (action: ActionTemplate<S>): boolean => {
    if (
      message.messageType === "EntityInteraction" &&
      isInteractionOfEntities(action)
    ) {
      const interactions = action.interaction(message.player)

      logs.verbose(
        action.name,
        `got`,
        interactions.length,
        `entity interaction${interactions.length > 1 ? "s" : ""}`,
        interactions.map((def) => JSON.stringify(def))
      )

      return interactions.some((definition) => {
        // Check props for every interactive entity in `targets` array
        return message.entities
          .filter((currentTarget) =>
            isChild(currentTarget) ? currentTarget.isInteractive() : false
          )
          .some((entity) => {
            const result = queryRunner(definition)(entity)
            if (result) {
              logs.notice(action.name, "match!")
            }
            return result
          })
      })
    } else if (message.messageType && isInteractionOfEvent(action)) {
      return action.interaction === message.messageType
    }
    return false
  }

export class ClientMessageConditions<S extends State> extends Conditions<
  S,
  ClientMessageConditions<S>
> {}

export interface ClientMessageConditions<S extends State> {
  /**
   * Changes current `subject` to game-specific player command. Defaults to "EntityInteraction"
   */
  messageType: ConditionsMethods<S, ClientMessageConditions<S>> //string;
  /**
   * Changes current `subject` to Interaction-related events ("click", "touchstart"...)
   */
  event: ConditionsMethods<S, ClientMessageConditions<S>> //string;
  /**
   * Changes current `subject` to event's additional data
   */
  data: ConditionsMethods<S, ClientMessageConditions<S>> //any;
  /**
   * Changes current `subject` to interacting `Player`
   */
  player: ConditionsMethods<S, ClientMessageConditions<S>> //Player;
  /**
   * Changes current `subject` to entity being interacted with
   */
  entity: ConditionsMethods<S, ClientMessageConditions<S>> //unknown;
}

export const filterActionsByConditions =
  <S extends State>(state: S, message: ServerPlayerMessage) =>
  (action: ActionTemplate<S>): boolean => {
    logs.group(`action: ${chalk.white(action.name)}`)

    const initialSubjects = Object.keys(message)
      .filter((key) => !["timestamp", "entities", "entityPath"].includes(key))
      .reduce((o, key) => {
        o[key] = message[key]
        return o
      }, {})

    const conditionsChecker = new ClientMessageConditions<S>(
      state,
      initialSubjects
    )

    let result = true
    let errorMessage = ""
    try {
      action.conditions(conditionsChecker)
    } catch (e) {
      result = false
      errorMessage = (e as Error).message
    }

    if (errorMessage) {
      logs.verbose("\t", errorMessage)
    }

    logs.groupEnd(
      `result: ${result ? chalk.green(result) : chalk.yellow(result)}`
    )

    return result
  }

/**
 * Tests if given action would pass tests when pushed to Commands Manager
 */
export const testAction = <S extends State>(
  action: ActionTemplate<S>,
  state: S,
  message: ServerPlayerMessage
): boolean => {
  return (
    filterActionsByInteraction(message)(action) &&
    filterActionsByConditions(state, message)(action)
  )
}
